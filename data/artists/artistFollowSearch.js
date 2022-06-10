import apiClient from "/data/client/apiClient";

async function artistFollowSearch(apiKey, artist) {
  try {
    const res = await apiClient.post("/following/search", {
      api_key: apiKey,
      artist: artist,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default artistFollowSearch;
