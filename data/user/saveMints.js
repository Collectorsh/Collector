import apiClient from "/data/client/apiClient";

async function saveMints(apiKey, mints) {
  const res = await apiClient.post("/user/save_mints", {
    api_key: apiKey,
    mints: mints,
  });
  return res;
}

export default saveMints;
