import apiClient from "/data/client/apiClient";

async function getMarketplaceStats() {
  try {
    const response = await apiClient.post("/featured/marketplace_stats");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getMarketplaceStats;
