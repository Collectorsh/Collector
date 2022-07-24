import apiClient from "/data/client/apiClient";

async function getOwnerCollectorName(address) {
  try {
    const res = await apiClient.post("/getusername", {
      public_key: address,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getOwnerCollectorName;
