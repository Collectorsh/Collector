import apiClient from "/data/client/apiClient";

async function getDropSecondary() {
  try {
    const res = await apiClient.post("/drops/listings");
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getDropSecondary;
