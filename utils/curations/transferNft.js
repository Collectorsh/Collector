import { createTransferCheckedInstruction, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { findATA } from "./findTokenAccountsByOwner";

export function getTransferNftTX(ownerAddress, recipientAddress, mintAddress, prevTokenAccount) {
  const ownerPubkey = new PublicKey(ownerAddress);
  const toPubkey = new PublicKey(recipientAddress);
  const mintPubkey = new PublicKey(mintAddress);

  const tokenAccount = prevTokenAccount || findATA(mintPubkey, ownerPubkey)
  const newTokenAccount = findATA(mintPubkey, toPubkey)

  const transferInstruction = createTransferCheckedInstruction(
    tokenAccount,
    mintPubkey,
    newTokenAccount,
    ownerPubkey,
    1, // Amount you are transferring.
    0 // Decimals, since this is an NFT you can leave 0.
  )

  //Need to skip this if the account already exists
  //TODO detect if exists
  const createTokenAccount = createAssociatedTokenAccountInstruction(
    ownerPubkey,
    new PublicKey(newTokenAccount),
    toPubkey,
    mintPubkey
  )

  const tx = new Transaction()
  tx.add(createTokenAccount)
  tx.add(transferInstruction)
  return tx
}