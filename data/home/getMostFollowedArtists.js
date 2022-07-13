import apiClient from "/data/client/apiClient";

async function getMostFollowedArtists() {
  try {
    const response = await apiClient.post("/featured/artists");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getMostFollowedArtists;
