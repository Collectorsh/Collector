import apiClient from "/data/client/apiClient";

async function addUser(apiKey, id) {
  try {
    const res = await apiClient.post("/hub/add_user", {
      api_key: apiKey,
      id: id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default addUser;
