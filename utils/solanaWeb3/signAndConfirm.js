import { sendAndConfirmRawTransaction } from "@solana/web3.js"
import { connection } from "../../config/settings"

//commitment: 'processed' | 'confirmed' | 'finalized'
export const signAndConfirmTx = async ({
  tx,
  wallet,
  errorMessage = "Error confirming transaction",
  commitment = "confirmed",
  skipPreflight = false
}) => { 
  const signedTx = await wallet.signTransaction(tx)

  try {
    const searchParams = new URLSearchParams(window?.location.search);
    if (searchParams?.has("simulate")) {
      const sim = await connection.simulateTransaction(signedTx)
      console.log("Sim :", sim)
      throw new Error("Simulating transaction")
    }
  } catch (error) {
    console.error("Error simulating transaction", error)
  }

  const signature = await sendAndConfirmRawTransaction(connection, signedTx.serialize(), { commitment, skipPreflight })
  if (!signature) throw new Error(errorMessage)
  return signature;
}