import apiClient from "/data/client/apiClient";

async function getFollowingAuctions(apiKey) {
  try {
    const res = await apiClient.post("/following/auctions", {
      api_key: apiKey,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getFollowingAuctions;
