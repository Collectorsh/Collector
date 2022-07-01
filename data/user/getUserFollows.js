import apiClient from "/data/client/apiClient";

async function getUserFollows(user_id) {
  try {
    const res = await apiClient.post("/user/follows", { user_id: user_id });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getUserFollows;
