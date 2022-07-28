import apiClient from "/data/client/apiClient";

async function getUserListings(id) {
  try {
    const res = await apiClient.post("/listing/by_user", { id: id });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
}

export default getUserListings;
