import { loginMessage } from "/config/settings";
import apiClient from "/data/client/apiClient";

async function getApiKey(publicKey, signMessage) {
  let nonce = await requestApiKey(publicKey.toBase58());
  if (typeof nonce === "string") {
    console.log("🚀 ~ file: getApiKey.js:8 ~ getApiKey ~ loginMessage:", loginMessage)
    let signature = await signMessage(Buffer.from(String(loginMessage) + nonce));
    let res = await createApiKey(
      publicKey.toBase58(),
      Buffer.from(signature),
      nonce
    );
    return res;
  }
}

async function createApiKey(publicKey, signature, nonce) {
  const res = await apiClient
    .post("/create_api_key", {
      signature: Buffer.from(signature),
      publicKey: publicKey,
      nonce: nonce,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return res;
}

async function requestApiKey(publicKey) {
  const res = await apiClient
    .post("/request_api_key", { publicKey: publicKey })
    .then((res) => {
      return res.data.nonce;
    })
    .catch((err) => {
      return err;
    });
  return res;
}

export default getApiKey;
