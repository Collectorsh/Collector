import { Keypair } from "@solana/web3.js";
import { formatRSAPublicKey } from "../../../utils/formatRSA";
import apiClient from "../../../data/client/apiClient";

import crypto from 'crypto'
import fs from "fs"

export default async function handler(req, res) {
  const { apiKey } = req.body;
  try {
    const HASH_NAME = "";
    const pathToMyKeypair = "";
    const keypairFile = fs.readFileSync(pathToMyKeypair);
    const secretKey = Buffer.from(JSON.parse(keypairFile.toString()));
    const keypair = Keypair.fromSecretKey(secretKey);

    const rsaPublicKey = formatRSAPublicKey(process.env.RSA_PUBLIC_KEY)
    const encryptedSecretKey = crypto.publicEncrypt({
      key: rsaPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
      keypair.secretKey
    )

    const apiResult = await apiClient.post("/key_hash/upload", {
      api_key: apiKey,
      hash: encryptedSecretKey.toString('base64'),
      name: HASH_NAME
    }).then(res => res.data)

    return res.status(200).json(apiResult);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}