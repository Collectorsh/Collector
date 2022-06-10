import apiClient from "/data/client/apiClient";
import { loginMessage } from "/config/settings";

async function verifyAddress(publicKey, signMessage, apiKey) {
  let nonce = await requestNonce(apiKey);
  if (typeof nonce === "string") {
    let signature = await sign(signMessage, nonce);
    let res = await addWallet(
      publicKey.toBase58(),
      Buffer.from(signature),
      nonce,
      apiKey
    );
    return res;
  }
}

async function sign(signMessage, nonce) {
  let res = await signMessage(Buffer.from(loginMessage + nonce));
  return res;
}

async function addWallet(publicKey, signature, nonce, apiKey) {
  const res = await apiClient
    .post("/add_wallet", {
      signature: Buffer.from(signature),
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
