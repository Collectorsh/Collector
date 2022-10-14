import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";

import { auctionHousesArray } from "/config/settings";

import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from "@solana/web3.js";

const web3 = require("@solana/web3.js");

const {
  createCancelInstruction,
  createCancelBidReceiptInstruction,
  createWithdrawInstruction,
} = AuctionHouseProgram.instructions;

export default async function cancelOfferTransaction(
  offer,
  nft,
  publicKey,
  signTransaction,
  refetch
) {
  if (!publicKey || !signTransaction || !offer || !nft) {
    return;
  }

  const auctionHaus = auctionHousesArray.filter(
    (a) => a.address === offer.auctionHouse.address
  )[0];

  const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });

  const auctionHouse = new PublicKey(auctionHaus.address);
  const authority = new PublicKey(auctionHaus.authority);
  const auctionHouseFeeAccount = new PublicKey(auctionHaus.feeAccount);
  const tokenMint = new PublicKey(nft.mint);

  const buyerPrice = offer.price;
  const tradeState = new PublicKey(offer.tradeState);

  const treasuryMint = new PublicKey(auctionHaus.treasuryMint);
  const tokenAccount = new PublicKey(nft.associatedTokenAccountAddress);

  const [bidReceipt, _bidReceiptBump] =
    await AuctionHouseProgram.findBidReceiptAddress(tradeState);

  const [escrowPaymentAccount, escrowPaymentBump] =
    await AuctionHouseProgram.findEscrowPaymentAccountAddress(
      auctionHouse,
      publicKey
    );

  const txt = new Transaction();

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

  const cancelBidReceiptInstructionAccounts = {
    receipt: bidReceipt,
    instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
  };

  const cancelBidInstruction = createCancelInstruction(
    cancelInstructionAccounts,
    cancelInstructionArgs
  );

  const cancelBidReceiptInstruction = createCancelBidReceiptInstruction(
    cancelBidReceiptInstructionAccounts
  );

  const withdrawInstructionAccounts = {
    receiptAccount: publicKey,
    wallet: publicKey,
    escrowPaymentAccount,
    auctionHouse,
    authority,
    treasuryMint,
    auctionHouseFeeAccount,
  };

  const withdrawInstructionArgs = {
    escrowPaymentBump,
    amount: buyerPrice,
  };

  const withdrawInstruction = createWithdrawInstruction(
    withdrawInstructionAccounts,
    withdrawInstructionArgs
  );

  txt
    .add(cancelBidInstruction)
    .add(cancelBidReceiptInstruction)
    .add(withdrawInstruction);

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
    toast.error(e.message);
  }
}
