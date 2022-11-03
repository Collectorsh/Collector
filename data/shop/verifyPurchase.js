import apiClient from "/data/client/apiClient";

async function verifyPurchase(apiKey, amount, duration, signature, publicKey) {
  const res = await apiClient.post(
    "/purchase/verify",
    {
      api_key: apiKey,
      amount: amount,
      duration: duration,
      signature: signature,
      public_key: publicKey,
    },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data;
}

export default verifyPurchase;
