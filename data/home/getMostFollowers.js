import apiClient from "/data/client/apiClient";

async function getMostFollowers() {
  try {
    const response = await apiClient.post("/featured/followers");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getMostFollowers;
