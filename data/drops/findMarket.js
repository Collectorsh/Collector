import apiClient from "/data/client/apiClient";

async function findMarket(mint) {
  try {
    let res = await apiClient.post("/drops/find_market", { mint: mint });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default findMarket;
