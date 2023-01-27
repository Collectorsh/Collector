import { rpcHost } from "/config/settings";
import { toast } from "react-toastify";

import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";

import { auctionHousesArray } from "/config/settings";

import {
  Transaction,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";

const web3 = require("@solana/web3.js");

const { createCancelInstruction, createCancelListingReceiptInstruction } =
  AuctionHouseProgram.instructions;

export default async function cancelListingTransaction(
  nft,
  listing,
  publicKey,
  signTransaction,
  refetch
) {
  if (!publicKey || !signTransaction) {
    return;
  }

  const auctionHaus = auctionHousesArray.filter(
    (a) => a.address === listing.auctionHouse.address
  )[0];

  const connection = new web3.Connection(rpcHost, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });

  const auctionHouse = new PublicKey(auctionHaus.address);
  const authority = new PublicKey(auctionHaus.authority);
  const auctionHouseFeeAccount = new PublicKey(auctionHaus.feeAccount);
  const tokenMint = new PublicKey(nft.mint);
  const treasuryMint = new PublicKey(auctionHaus.treasuryMint);
  const tokenAccount = new PublicKey(nft.associatedTokenAccountAddress);

  const buyerPrice = listing.price;

  const [tradeState] = await AuctionHouseProgram.findTradeStateAddress(
    publicKey,
    auctionHouse,
    tokenAccount,
    treasuryMint,
    tokenMint,
    buyerPrice,
    1
  );

  const [listingReceipt, _listingReceiptBump] =
    await AuctionHouseProgram.findListingReceiptAddress(
      new PublicKey(listing.tradeState)
    );

  const cancelInstructionAccounts = {
    wallet: publicKey,
    tokenAccount,
    tokenMint,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    tradeState,
  };
  const cancelInstructionArgs = {
    buyerPrice,
    tokenSize: 1,
  };

  const cancelListingReceiptAccounts = {
    receipt: listingReceipt,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const cancelInstruction = createCancelInstruction(
    cancelInstructionAccounts,
    cancelInstructionArgs
  );
  const cancelListingReceiptInstruction = createCancelListingReceiptInstruction(
    cancelListingReceiptAccounts
  );

  const txt = new Transaction();

  txt.add(cancelInstruction).add(cancelListingReceiptInstruction);

  txt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  txt.feePayer = publicKey;

  let signed;

  try {
    signed = await signTransaction(txt);
  } catch (e) {
    toast.error(e.message);
    return;
  }

  try {
    toast("Sending the transaction to Solana.");

    await web3.sendAndConfirmRawTransaction(connection, signed.serialize());

    refetch();

    toast.success("The transaction was confirmed.");
  } catch (e) {
    toast.error(
      "The transaction failed to confirm. Pleas check with an explorer."
    );
  }
}
