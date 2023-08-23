import apiClient from "../client/apiClient";

async function getPrivateContent({ name, apiKey }) {
  try {
    let res = await apiClient.post("/curation/get_private_content", {
      name: name,
      api_key: apiKey,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getPrivateContent;