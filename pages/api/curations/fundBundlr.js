import crypto from 'crypto'
import getKeyHash from "../../../data/key_hash/getHash"
import { formatRSAPrivateKey } from '../../../utils/formatRSA'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Metaplex, PublicKey, bundlrStorage, keypairIdentity, sol, toBigNumber, toMetaplexFile, toMetaplexFileFromBrowser } from '@metaplex-foundation/js'
import { connection } from '../../../config/settings'
import apiClient from '../../../data/client/apiClient'
import { transferSol } from '../../../utils/solanaWeb3/transferSol'

export default async function handler(req, res) {
  return res.status(404)
  
  console.log("HIT Fund func")

  const { addressToFund, lamportsRequested, apiKey } = req.body;

  if (lamportsRequested > 0.1 * LAMPORTS_PER_SOL) {
    res.status(400).json({error: "Are you sure you need that many Lamports?"})
    return
  }

  // const verifiedUser = await apiClient.post("user/verify",
  //   { api_key: apiKey }
  // ).then(res => res.data.verified)

  // if (!verifiedUser) {
  //   res.status(400).json({error: "Not a verified user."})
  //   return
  // }

  const fundingHash = await getKeyHash("curation_authority_funds")

  const fundingPrivateKey = crypto.privateDecrypt(
    {
      key: formatRSAPrivateKey(process.env.RSA_PRIVATE_KEY),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(fundingHash, "base64")
  )

  const fundingKeypair = Keypair.fromSecretKey(fundingPrivateKey)

  const rentException = await connection.getMinimumBalanceForRentExemption(0)
  console.log("🚀 ~ file: fundBundlr.js:43 ~ handler ~ rentException:", rentException)

  const fees = 10010

  await transferSol({
    fromKeypair: fundingKeypair,
    toPubkey: new PublicKey(addressToFund),
    lamportsToTransfer: Number(lamportsRequested) + rentException + fees
  })

  res.status(200).json({ returnAddress: fundingKeypair.publicKey.toString() })
}