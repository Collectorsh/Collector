import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";
import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";

import {
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { Metaplex } from "@metaplex-foundation/js";
const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
const metaplex = new Metaplex(connection);

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
  auctionHouseAddress
) {
  if (!publicKey || !signTransaction || !nft) {
    return;
  }

  console.log(auctionHouseAddress);

  const ah = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey(auctionHouseAddress),
  });

  const auctionHouse = ah.address;
  const authority = ah.authorityAddress;
  const auctionHouseFeeAccount = ah.feeAccountAddress;
  const treasuryMint = ah.treasuryMint.address;

  const buyerPrice = Number(amount) * LAMPORTS_PER_SOL;
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

    refetch(nft);

    toast.success("The transaction was confirmed.");
  } catch (e) {
    toast.error(e.message);
  }
}
