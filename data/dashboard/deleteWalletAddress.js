import apiClient from "/data/client/apiClient";

async function deleteWalletAddress(publicKey, apiKey) {
  let res = await apiClient.post("/deletewallet", {
    public_key: publicKey,
    api_key: apiKey,
  });
  return res;
}

export default deleteWalletAddress;
