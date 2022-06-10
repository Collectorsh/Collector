import apiClient from "/data/client/apiClient";

async function getUserFromUsername(username) {
  try {
    let res = await apiClient.post("/user/from_username", {
      username: username,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getUserFromUsername;
