import { toast } from "react-toastify";
import { AuctionHouseProgram } from "@metaplex-foundation/mpl-auction-house";

import {
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import { Metaplex } from "@metaplex-foundation/js";
const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
const metaplex = new Metaplex(connection);

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

  const ah = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey(offer.auctionHouse.address),
  });

  const auctionHouse = ah.address;
  const authority = ah.authorityAddress;
  const auctionHouseFeeAccount = ah.feeAccountAddress;
  const treasuryMint = ah.treasuryMint.address;

  const tokenMint = new PublicKey(nft.mint);
  const buyerPrice = offer.price;
  const tradeState = new PublicKey(offer.tradeState);
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

    refetch(nft);

    toast.success("The transaction was confirmed.");
  } catch (e) {
    toast.error(e.message);
  }
}
