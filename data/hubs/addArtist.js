import apiClient from "/data/client/apiClient";

async function addArtist(apiKey, id) {
  try {
    const res = await apiClient.post("/hub/add_artist", {
      api_key: apiKey,
      id: id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default addArtist;
