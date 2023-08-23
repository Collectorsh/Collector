
import apiClient from "../client/apiClient";

async function getCurationsByApprovedArtist(artistId) {
  try {
    let res = await apiClient.post("/curation/get_by_approved_artist", {
      artist_id: artistId,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getCurationsByApprovedArtist;