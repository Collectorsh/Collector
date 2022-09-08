import apiClient from "/data/client/apiClient";

async function getLiveAuctions() {
  try {
    const res = await apiClient.post("/auctions/live");
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getLiveAuctions;
