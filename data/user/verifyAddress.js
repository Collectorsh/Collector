import axios from "axios";
import apiClient from "/data/client/apiClient";
import { loginMessage } from "/config/settings";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

async function verifyAddress(
  publicKey,
  signMessage,
  apiKey,
  signTransaction,
  ledger
) {
  let nonce = await requestNonce(apiKey);
  if (typeof nonce === "string") {
    var signature;
    if (!ledger) {
      signature = await sign(signMessage, nonce);
      signature = Buffer.from(signature);
      let res = await addWallet(publicKey.toBase58(), signature, nonce, apiKey);
      return res;
    } else {
      let message = loginMessage + nonce;
      let tx = await buildAuthTx(message);
      tx.feePayer = publicKey;
      const connection = new anchor.web3.Connection(
        process.env.NEXT_PUBLIC_CANDYMACHINE_RPC
      );
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      let signedTx = await signTransaction(tx);
      let res = await axios.post(
        "/api/verify",
        {
          nonce: nonce,
          tx: signedTx.serialize(),
          apiKey: apiKey,
        },
        {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      );
      return res;
    }
  }
}

async function buildAuthTx(message) {
  const tx = new Transaction();
  tx.add(
    new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [],
      data: Buffer.from(message, "utf8"),
    })
  );
  return tx;
}

async function sign(signMessage, nonce) {
  let res = await signMessage(Buffer.from(loginMessage + nonce));
  return res;
}

async function addWallet(publicKey, signature, nonce, apiKey) {
  const res = await apiClient
    .post("/add_wallet", {
      signature: signature,
      public_key: publicKey,
      nonce: nonce,
      api_key: apiKey,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return res;
}

async function requestNonce(apiKey) {
  const res = await apiClient
    .post("/request_nonce", { api_key: apiKey })
    .then((res) => {
      return res.data.nonce;
    })
    .catch((err) => {
      return err;
    });
  return res;
}

export default verifyAddress;
