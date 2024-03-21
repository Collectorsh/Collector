import apiClient from "../client/apiClient";

async function saveDraftContent({ draftContent, name, apiKey, curationId }) {
  try {
    let res = await apiClient.post("/curation/save_draft_content", {
      name: name,
      draft_content: draftContent,
      api_key: apiKey,
      curation_id: curationId
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default saveDraftContent;