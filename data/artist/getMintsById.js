import apiClient from "/data/client/apiClient";

async function getMintsById(id) {
  try {
    const res = await apiClient.post("/user/mints", { id: id });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export default getMintsById;
