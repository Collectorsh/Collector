import apiClient from "/data/client/apiClient";

async function getCollectorBids() {
  try {
    const res = await apiClient.post("/watchlist/bids");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getCollectorBids;
