import apiClient from "/data/client/apiClient";

async function getDaos() {
  try {
    const res = await apiClient.post("/galleries/daos");
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getDaos;
