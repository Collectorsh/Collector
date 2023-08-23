import apiClient from "../client/apiClient";

async function getKeyHash(name) {
  try {
    const res = await apiClient.post("/key_hash/get_hash", {
      name
    })

    return res.data.hash;
  } catch (err) {
    console.log(err);
  }
}

export default getKeyHash;