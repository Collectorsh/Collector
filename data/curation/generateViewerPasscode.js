import apiClient from "../client/apiClient";

async function generateViewerPasscode({ apiKey, name }) {
  try {
    let res = await apiClient.post("/curation/generate_viewer_passcode", {
      api_key: apiKey,
      name,
    });
    if(!res?.data?.passcode) throw new Error("Failed to generate viewer passcode")
    return res.data.passcode;
  } catch (err) {
    console.log(err);
  }
}

export default generateViewerPasscode;