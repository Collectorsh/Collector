import apiClient from "/data/client/apiClient";

async function getBuyNowFeed() {
  try {
    const response = await apiClient.post("/feed/listings");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getBuyNowFeed;
