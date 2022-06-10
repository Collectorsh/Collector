import apiClient from "/data/client/apiClient";

async function getFeedFollowing(apiKey) {
  try {
    const response = await apiClient.post("/feed/following", {
      api_key: apiKey,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getFeedFollowing;
