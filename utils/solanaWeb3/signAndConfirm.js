import { sendAndConfirmRawTransaction } from "@solana/web3.js"
import { connection } from "../../config/settings"

//commitment: 'processed' | 'confirmed' | 'finalized'
export const signAndConfirmTx = async ({
  tx,
  wallet,
  errorMessage = "Error confirming transaction",
  commitment = "confirmed"
}) => { 
  const signedTx = await wallet.signTransaction(tx)
  const signature = sendAndConfirmRawTransaction(connection, signedTx.serialize(), { commitment })
  if (!signature) throw new Error(errorMessage)
  return signature;
}