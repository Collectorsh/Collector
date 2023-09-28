import { LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { connection } from "../../config/settings";

export const transferSol = async ({ fromKeypair, toPubkey, lamportsToTransfer }) => {
  const transferTX = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPubkey,
      lamports: lamportsToTransfer,
    }),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await sendAndConfirmTransaction(
    connection,
    transferTX,
    [fromKeypair],
    { commitment: 'finalized' }
  );
  console.log(`Transferred ${ lamportsToTransfer / LAMPORTS_PER_SOL} SOl to ${ toPubkey.toString() }`);
  console.log(`TX hash: ${ signature }`);
  return signature
}
