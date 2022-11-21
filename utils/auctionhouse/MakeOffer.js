import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";
import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";

import { auctionHousesArray } from "/config/settings";

import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const web3 = require("@solana/web3.js");

const {
  createPublicBuyInstruction,
  createDepositInstruction,
  createPrintBidReceiptInstruction,
} = AuctionHouseProgram.instructions;

export default async function makeOfferTransaction(
  amount,
  nft,
  publicKey,
  signTransaction,
  refetch,
  tokenHolder
) {
  if (!publicKey || !signTransaction || !nft) {
    return;
  }

  var auctionHaus;

  if (tokenHolder) {
    auctionHaus = auctionHousesArray.filter((a) => a.name === "holder")[0];
  } else {
    auctionHaus = auctionHousesArray.filter((a) => a.name === "default")[0];
  }

  const solNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  const connection = new web3.Connection(web3.clusterApiUrl(solNetwork), {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });

  const buyerPrice = Number(amount) * LAMPORTS_PER_SOL;
  const auctionHouse = new PublicKey(auctionHaus.address);
  const authority = new PublicKey(auctionHaus.authority);
  const auctionHouseFeeAccount = new PublicKey(auctionHaus.feeAccount);
  const treasuryMint = new PublicKey(auctionHaus.treasuryMint);
  const tokenMint = new PublicKey(nft.mint);
  const tokenAccount = new PublicKey(nft.associatedTokenAccountAddress);

  const [escrowPaymentAccount, escrowPaymentBump] =
    await AuctionHouseProgram.findEscrowPaymentAccountAddress(
      auctionHouse,
      publicKey
    );

  const [buyerTradeState, tradeStateBump] =
    await AuctionHouseProgram.findPublicBidTradeStateAddress(
      publicKey,
      auctionHouse,
      treasuryMint,
      tokenMint,
      buyerPrice,
      1
    );

  const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

  const txt = new Transaction();

  const depositInstructionAccounts = {
    wallet: publicKey,
    paymentAccount: publicKey,
    transferAuthority: publicKey,
    treasuryMint,
    escrowPaymentAccount,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
  };

  const depositInstructionArgs = {
    escrowPaymentBump,
    amount: buyerPrice,
  };

  const depositInstruction = createDepositInstruction(
    depositInstructionAccounts,
    depositInstructionArgs
  );

  const publicBuyInstruction = createPublicBuyInstruction(
    {
      wallet: publicKey,
      paymentAccount: publicKey,
      transferAuthority: publicKey,
      treasuryMint,
      tokenAccount,
      metadata,
      escrowPaymentAccount,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
      buyerTradeState,
    },
    {
      escrowPaymentBump,
      tradeStateBump,
      tokenSize: 1,
      buyerPrice,
    }
  );

  const [receipt, receiptBump] =
    await AuctionHouseProgram.findBidReceiptAddress(buyerTradeState);

  const printBidReceiptInstruction = createPrintBidReceiptInstruction(
    {
      receipt,
      bookkeeper: publicKey,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    },
    {
      receiptBump,
    }
  );

  txt
    .add(depositInstruction)
    .add(publicBuyInstruction)
    .add(printBidReceiptInstruction);

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
