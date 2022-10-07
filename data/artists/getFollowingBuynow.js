import apiClient from "/data/client/apiClient";

async function getFollowingBuynow(apiKey) {
  try {
    const res = await apiClient.post("/following/listings", {
      api_key: apiKey,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getFollowingBuynow;
