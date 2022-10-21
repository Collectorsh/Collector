import apiClient from "/data/client/apiClient";

async function getFollowingById(id) {
  try {
    const res = await apiClient.post("/following/id", { user_id: id });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getFollowingById;
