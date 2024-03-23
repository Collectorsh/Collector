import apiClient from "/data/client/apiClient";

async function mergeAccounts(apiKey, mergingApiKey) {
  try {
    const res = await apiClient.post("/user/merge_accounts", {
      api_key: apiKey,
      merging_api_key: mergingApiKey,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export default mergeAccounts;
