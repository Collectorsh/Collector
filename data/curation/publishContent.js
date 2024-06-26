import apiClient from "../client/apiClient";

async function publishContent({ draftContent, name, apiKey, curationId }) {
  try {
    let res = await apiClient.post("/curation/publish_content", {
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

export default publishContent;

export async function unpublishContent({ name, apiKey, curationId }) {
  try {
    let res = await apiClient.post("/curation/unpublish_content", {
      name: name,
      api_key: apiKey,
      curation_id: curationId
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}