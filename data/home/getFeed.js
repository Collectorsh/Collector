import apiClient from "/data/client/apiClient";

async function getFeed(user_id = null) {
  try {
    const response = await apiClient.post("/feed/get", { user_id: user_id });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getFeed;
