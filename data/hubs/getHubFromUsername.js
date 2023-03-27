import apiClient from "/data/client/apiClient";

async function getHubFromUsername(username) {
  try {
    const res = await apiClient.post("/hub/from_username", {
      username: username,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getHubFromUsername;
