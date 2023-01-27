import apiClient from "/data/client/apiClient";

async function verifyPurchase(
  api_key,
  amount,
  signature,
  publicKey,
  order,
  address
) {
  const res = await apiClient.post(
    "/purchase/verify",
    {
      api_key: api_key,
      amount: amount,
      signature: signature,
      public_key: publicKey,
      order: order,
      address: address,
    },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );
  return res.data;
}

export default verifyPurchase;
