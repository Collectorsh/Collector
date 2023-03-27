import apiClient from "/data/client/apiClient";

async function fetchAllUsers(apiKey) {
  try {
    const res = await apiClient.post("/hub/fetch_all_users", {
      api_key: apiKey,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default fetchAllUsers;
