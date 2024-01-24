import { ComputeBudgetProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import  bs58 from "bs58";
import { connection } from "../../config/settings";

const defaultPriorityFee = 70000 //microlamports
// priorityLevel: "MIN", "LOW", "MEDIUM", "HIGH", "VERYHIGH", "UNSAFEMAX"
export async function getPriorityFeeInstruction(transaction, priorityLevel = "VERYHIGH") {
  let fee = defaultPriorityFee

  // const budgetIx = ComputeBudgetProgram.setComputeUnitLimit({units: 1250})
  // transaction.add(budgetIx)

  try {
    let serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    })
   
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`,
      {
        jsonrpc: "2.0",
        id: "FeeEstimate-Collector",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: bs58.encode(serializedTx), // Pass the serialized transaction in Base58
            options: { priority_level: priorityLevel },
          },
        ],
      }
    );
    
    const estimatedFee = response.data?.result?.priorityFeeEstimate;
    if (!estimatedFee) throw new Error("No response from Helius API");
    console.log("Estimated Priority Fee:", estimatedFee)
    fee = Math.ceil(estimatedFee);
  } catch (error) {
    console.log("Error getting priority fee estimate: ", error);
  }

  const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee })
  return priorityFeeIx
  // return new Transaction().add(priorityFeeIx).add(budgetIx) 

}

export const makeTxWithPriorityFeeFromMetaplexBuilder = async (builder, feePayer) => {

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

  const TX = builder.toTransaction({
    blockhash,
    lastValidBlockHeight,
  })

  TX.feePayer = feePayer

  const priorityFeeIx = await getPriorityFeeInstruction(TX)
  
  TX.add(priorityFeeIx)
  
  const signers = []
  builder.getSigners().forEach(signer => {
    //gets all true signers that aren't the wallet identity
    if (signer.secretKey) {
      signers.push({
        secretKey: signer.secretKey,
        publicKey: signer.publicKey,
      })
    }
  })
  if (signers.length > 0) TX.partialSign(...signers)

  return TX
}