import { sendAndConfirmRawTransaction } from "@solana/web3.js"
import { connection } from "../../config/settings"
import { warning } from "../../utils/toast";

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

  let signature;



  try {
    signature = await sendAndConfirmRawTransaction(connection, signedTx.serialize(), { commitment, skipPreflight })
  } catch (err) {
    console.log(err)
    if (err.message.includes("not confirmed")) {
      warning("Your transaction didn't go through. Please try again.")
    } else {
      throw new Error(err)
    }
  }

  if (!signature) throw new Error(errorMessage)
  return signature;
}

export const timeoutError = "Transaction timed out. Please try again."