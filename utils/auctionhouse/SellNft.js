import { toast } from "react-toastify";

import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";
import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";

import { auctionHousesArray } from "/config/settings";

import {
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";

const web3 = require("@solana/web3.js");

const { createSellInstruction, createPrintListingReceiptInstruction } =
  AuctionHouseProgram.instructions;

export default async function sellNftTransaction(
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
  const associatedTokenAccount = new PublicKey(
    nft.associatedTokenAccountAddress
  );
  const [sellerTradeState, tradeStateBump] =
    await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      associatedTokenAccount,
      treasuryMint,
      tokenMint,
      buyerPrice,
      1
    );

  const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

  const [programAsSigner, programAsSignerBump] =
    await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

  const [freeTradeState, freeTradeBump] =
    await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      associatedTokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );

  const txt = new Transaction();

  const sellInstructionArgs = {
    tradeStateBump,
    freeTradeStateBump: freeTradeBump,
    programAsSignerBump: programAsSignerBump,
    buyerPrice,
    tokenSize: 1,
  };

  const sellInstructionAccounts = {
    wallet: publicKey,
    tokenAccount: associatedTokenAccount,
    metadata: metadata,
    authority: authority,
    auctionHouse: auctionHouse,
    auctionHouseFeeAccount: auctionHouseFeeAccount,
    sellerTradeState: sellerTradeState,
    freeSellerTradeState: freeTradeState,
    programAsSigner: programAsSigner,
  };

  const sellInstruction = createSellInstruction(
    sellInstructionAccounts,
    sellInstructionArgs
  );

  const [receipt, receiptBump] =
    await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

  const printListingReceiptInstruction = createPrintListingReceiptInstruction(
    {
      receipt,
      bookkeeper: publicKey,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    },
    {
      receiptBump,
    }
  );

  txt.add(sellInstruction).add(printListingReceiptInstruction);

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
