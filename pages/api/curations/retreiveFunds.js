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

  console.log("HIT reFund func")

  const { closingPrivateKey } = req.body;


  res.status(200)
}