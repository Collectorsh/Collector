import apiClient from "/data/client/apiClient";

async function fetchCurator(apiKey) {
  try {
    const res = await apiClient.post("/hub/fetch_config", {
      api_key: apiKey,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default fetchCurator;
