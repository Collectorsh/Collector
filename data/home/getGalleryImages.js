import apiClient from "/data/client/apiClient";

async function getGalleryImages() {
  try {
    const res = await apiClient.post("/galleries/sample");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export default getGalleryImages;
