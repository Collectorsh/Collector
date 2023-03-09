import apiClient from "/data/client/apiClient";

async function getAllDrops() {
  try {
    let res = await apiClient.get("/drops");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getAllDrops;
