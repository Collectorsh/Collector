import apiClient from "../client/apiClient";

async function getPrivateContent({ name, apiKey }) {
  try {
    let res = await apiClient.post("/curation/get_private_content", {
      name: name,
      api_key: apiKey
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getPrivateContent;

export async function getViewerPrivateContent({ name, apiKey, viewerPasscode }) {
  try {
    let res = await apiClient.post("/curation/get_viewer_private_content", {
      name: name,
      api_key: apiKey,
      viewer_passcode: viewerPasscode
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}