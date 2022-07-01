import apiClient from "/data/client/apiClient";

async function getMostWins() {
  try {
    const response = await apiClient.post("/featured/wins");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getMostWins;
