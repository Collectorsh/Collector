import apiClient from "/data/client/apiClient";

async function getUserBids(user_id) {
  try {
    const res = await apiClient.post("/user/bids", { user_id: user_id });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getUserBids;
