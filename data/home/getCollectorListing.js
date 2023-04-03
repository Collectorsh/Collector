import apiClient from "/data/client/apiClient";

async function getCollectorListing() {
  try {
    const res = await apiClient.post("/listing/collector");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export default getCollectorListing;
