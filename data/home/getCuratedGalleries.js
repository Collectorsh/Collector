import apiClient from "/data/client/apiClient";

async function getCuratedGalleries() {
  try {
    const res = await apiClient.post("/galleries/curated");
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getCuratedGalleries;
