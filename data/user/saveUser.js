import apiClient from "/data/client/apiClient";

async function saveUser(apiKey, attributes) {
  try {
    const res = await apiClient.post("/user/save", {
      api_key: apiKey,
      attributes: attributes,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
}

export default saveUser;
