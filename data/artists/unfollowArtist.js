import apiClient from "/data/client/apiClient";

async function unfollowArtist(apiKey, artist) {
  try {
    const res = await apiClient.post("/following/unfollow", {
      api_key: apiKey,
      artist: artist,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default unfollowArtist;
