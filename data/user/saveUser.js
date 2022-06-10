import apiClient from "/data/client/apiClient";

async function saveUser(apiKey, attributes) {
  const res = await apiClient.post("/user/save", {
    api_key: apiKey,
    attributes: attributes,
  });
  return res;
}

export default saveUser;
