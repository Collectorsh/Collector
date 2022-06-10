import apiClient from "/data/client/apiClient";

async function followArtist(apiKey, artist) {
  try {
    const res = await apiClient.post("/following/follow", {
      api_key: apiKey,
      artist: artist,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default followArtist;
