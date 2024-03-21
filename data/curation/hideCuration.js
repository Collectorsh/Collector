import apiClient from "../client/apiClient";

export async function hideCuration({ name, apiKey, curationId }) {
  try {
    let res = await apiClient.post("/curation/hide_curation", {
      name: name,
      api_key: apiKey,
      curation_id: curationId
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}