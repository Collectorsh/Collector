import apiClient from "/data/client/apiClient";

async function getNewArtistAuctions() {
  try {
    const response = await apiClient.post("/auctions/new");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getNewArtistAuctions;
