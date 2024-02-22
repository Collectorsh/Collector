import apiClient from "/data/client/apiClient";

async function getUserFromApiKey(apiKey) {
  try {
    const response = await apiClient.post("/user/from_api_key", {
      api_key: apiKey,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default getUserFromApiKey;
