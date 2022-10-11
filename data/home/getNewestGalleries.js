import apiClient from "/data/client/apiClient";

async function getNewestGalleries() {
  try {
    const res = await apiClient.post("/galleries/new");
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getNewestGalleries;
