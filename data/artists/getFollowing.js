import apiClient from "/data/client/apiClient";

async function getFollowing(apiKey) {
  try {
    const res = await apiClient.post("/following/get", { api_key: apiKey });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getFollowing;
