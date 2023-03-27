import apiClient from "/data/client/apiClient";

async function removeUser(apiKey, id) {
  try {
    const res = await apiClient.post("/hub/remove_user", {
      api_key: apiKey,
      id: id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default removeUser;
