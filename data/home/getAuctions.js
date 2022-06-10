import apiClient from "/data/client/apiClient";

async function getAuctions() {
  try {
    const response = await apiClient.post("/auctions/get");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getAuctions;
