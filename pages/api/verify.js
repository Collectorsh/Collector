import apiClient from "/data/client/apiClient";
import { loginMessage } from "/config/settings";
import { PublicKey, Transaction } from "@solana/web3.js";

export default async function handler(req, res) {
  const MEMO_PROGRAM_ID = new PublicKey(
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
  );

  try {
    var tx = req.body.tx.data;
    tx = Transaction.from(Buffer.from(tx));
    const inx = tx.instructions.find(inx => inx.programId.toBase58() == MEMO_PROGRAM_ID)
    
    if (!inx)
      return res
        .status(200)
        .json({ status: "error", msg: "Incorrect program ID" });
    if (Buffer.from(inx.data.toString()) != loginMessage + req.body.nonce)
      return res.status(200).json({
        status: "error",
        msg: "Incorrect message",
      });
    if (!tx.verifySignatures())
      return res
        .status(200)
        .json({ status: "error", msg: "Signature verifcation failed" });
    const resp = await apiClient
      .post("/add_wallet_with_secret", {
        api_key: req.body.apiKey,
        public_key: tx.signatures[0].publicKey.toBase58(),
        secret: process.env.NEXT_PUBLIC_SECRET,
      })
      .then((resp) => {
        console.log(resp);
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    return res.status(200).json(resp.data);
  } catch (err) {
    return res.status(200).json({ status: "error", msg: err.message });
  }
}
