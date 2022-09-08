import apiClient from "/data/client/apiClient";

async function getPopularGalleries() {
  try {
    const res = await apiClient.post("/galleries/popular");
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getPopularGalleries;
