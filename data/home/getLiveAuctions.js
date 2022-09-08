import apiClient from "/data/client/apiClient";

async function getLiveAuctions() {
  try {
    const res = await apiClient.post("/auctions/live");
    console.log(res)
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getLiveAuctions;
