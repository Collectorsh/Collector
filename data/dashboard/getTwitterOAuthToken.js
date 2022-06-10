import apiClient from "/data/client/apiClient";

async function getTwitterOAuthToken(api_key) {
  try {
    const res = await apiClient.post("/auth/create", { api_key: api_key });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getTwitterOAuthToken;
