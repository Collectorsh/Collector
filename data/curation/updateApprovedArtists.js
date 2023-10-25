import apiClient from "../client/apiClient";

async function updateApprovedArtists({ artistIds, name, apiKey }) {
  try {
    let res = await apiClient.post("/curation/update_approved_artists", {
      name: name,
      artist_ids: artistIds,
      api_key: apiKey
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default updateApprovedArtists;


export async function addSelfApprovedArtists({ apiKey, viewerPasscode }) {
  try {
    let res = await apiClient.post("/curation/update_self_as_approved_artists", {
      api_key: apiKey,
      viewer_passcode: viewerPasscode
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}