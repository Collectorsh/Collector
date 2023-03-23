import apiClient from "/data/client/apiClient";

async function saveConfig(apiKey, args) {
  try {
    const res = await apiClient.post("/hub/save_config", {
      api_key: apiKey,
      args: args,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default saveConfig;
