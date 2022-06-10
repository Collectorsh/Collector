import apiClient from "/data/client/apiClient";

async function getFeed() {
  try {
    const response = await apiClient.post("/feed/get");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getFeed;
