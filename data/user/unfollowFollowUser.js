import apiClient from "/data/client/apiClient";

async function unfollowFollowUser(apiKey, user_id, action) {
  const res = await apiClient.post("/user/follow_unfollow", {
    api_key: apiKey,
    user_id: user_id,
    doaction: action,
  });
  return res;
}

export default unfollowFollowUser;
