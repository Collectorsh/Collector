import apiClient from "/data/client/apiClient";

async function getRecentSales() {
  try {
    const response = await apiClient.post("/sales/recent");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getRecentSales;
