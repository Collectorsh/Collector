import apiClient from "/data/client/apiClient";

async function verifyPurchase(
  api_key,
  amount,
  signature,
  order,
  address,
  publicKey
) {
  const res = await apiClient.post(
    "/purchase/verify",
    {
      api_key: api_key,
      amount,
      signature: signature,
      order: order,
      address: address,
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
