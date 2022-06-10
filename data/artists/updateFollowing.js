import apiClient from "/data/client/apiClient";

async function updateFollowing(apiKey, artist, state, notification_type) {
  try {
    const res = await apiClient.post("/following/update", {
      api_key: apiKey,
      artist: artist,
      state: state,
      notification_type: notification_type,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default updateFollowing;
