import { sendAndConfirmRawTransaction,  } from "@solana/web3.js"
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

  signature = await connection.sendRawTransaction(signedTx.serialize(), { commitment, skipPreflight });
  let final = await txFinalized(signature);
  
  //Second try
  if (final !== "finalized") {
    await new Promise(_ => setTimeout(_, 3000));
    signature = await connection.sendRawTransaction(signedTx.serialize(), { commitment, skipPreflight });
    final = await txFinalized(signature);
  }

  if (final !== "finalized") { 
    signature = null;
    warning("Your transaction didn't go through. Please try again.")
  }

  if (!signature) throw new Error(errorMessage)
  return signature;
}

export const timeoutError = "Transaction timed out. Please try again."


export async function signAndConfirmTxWithKeypairs({
  tx,
  keypairs,
  commitment = "finalized",
}) {
  let signature = await connection.sendTransaction(
    tx,
    keypairs,
    { commitment}
  );

  let final = await txFinalized(signature);

  //Second try
  if (final !== "finalized") {
    await new Promise(_ => setTimeout(_, 3000));
    const block = await connection.getLatestBlockhash();
    withdrawTX.recentBlockhash = block.blockhash
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    signature = await connection.sendTransaction(
      tx,
      keypairs,
      { commitment: 'finalized' }
    );
    final = await txFinalized(signature);
  }

  if (final !== "finalized") {
    throw new Error("Your transaction didn't go through. Please try again.")
  }

  return signature;
}

// verifies finalized status of signature
// https://github.com/McDegens-DAO/txFinalized/blob/main/README.md
export async function txFinalized(sig, max = 40, seconds = 4) {
  return await new Promise(resolve => {
    let start = 1;
    seconds = (seconds * 1000);
    // let connection = new solanaWeb3.Connection(cluster, "confirmed");
    let intervalID = setInterval(async () => {
      // console.log(start + ": " + sig);
      let tx_status = await connection.getSignatureStatuses([sig], { searchTransactionHistory: true, });
      // console.log(tx_status.value[0]);
      if (start > 20 && tx_status.value[0] == null) {
        clearInterval(intervalID);
        console.log('Oh No! Something Happened!');
        resolve('Oh No! Something Happened!');
      }
      if (typeof tx_status == "undefined" ||
        typeof tx_status.value == "undefined" ||
        tx_status.value == null ||
        tx_status.value[0] == null ||
        typeof tx_status.value[0] == "undefined" ||
        typeof tx_status.value[0].confirmationStatus == "undefined") { }
      else if (tx_status.value[0].confirmationStatus == "processed") {
        console.log('Transaction Processed!');
        start = 1;
      }
      else if (tx_status.value[0].confirmationStatus == "confirmed") {
        console.log('Transaction Confirmed!');
        start = 1;
      }
      else if (tx_status.value[0].confirmationStatus == "finalized") {
        console.log('Transaction Complete!');
        clearInterval(intervalID);
        resolve('finalized');
      }
      start++;
      if (start == max) {
        clearInterval(intervalID);
        resolve(max + ' max retrys reached');
      }
    }, seconds);
  });
}