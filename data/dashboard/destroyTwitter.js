import apiClient from "/data/client/apiClient";

async function destroyTwitter(api_key) {
  try {
    const res = await apiClient.post("/auth/destroy", { api_key: api_key });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default destroyTwitter;
