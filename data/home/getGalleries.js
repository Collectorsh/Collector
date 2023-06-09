import apiClient from "/data/client/apiClient";


//only twitter images
async function getGalleries() {
  try {
    const response = await apiClient.post("/galleries/get");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default getGalleries;
