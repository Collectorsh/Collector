import apiClient from "../client/apiClient";

async function deleteSubmission({ apiKey, tokenMint, curationId }) {
  try {
    let res = await apiClient.post("/curation_listing/delete_submission", {
      api_key: apiKey,
      curation_id: curationId,
      token_mint: tokenMint,
    })
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default deleteSubmission;