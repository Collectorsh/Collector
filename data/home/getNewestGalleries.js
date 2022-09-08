import apiClient from "/data/client/apiClient";

async function getNewestGalleries() {
  try {
    const res = await apiClient.post("/galleries/new");
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getNewestGalleries;
