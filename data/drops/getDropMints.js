import apiClient from "/data/client/apiClient";

async function getDropMints(id) {
  try {
    let res = await apiClient.post("/drops/mints", {
      id: id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getDropMints;
