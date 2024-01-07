import apiClient from "../client/apiClient";

export async function submitTokens({
  tokens,
  apiKey,
  curationId,
  ownerId,
}) {
  try {
    const res = await apiClient.post("/curation_listing/submit_tokens", {
      tokens: tokens,
      api_key: apiKey,
      curation_id: curationId,
      owner_id: ownerId,
    })
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
