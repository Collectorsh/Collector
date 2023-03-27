import apiClient from "/data/client/apiClient";

async function saveConfig(apiKey, name, description, auction_house) {
  try {
    const res = await apiClient.post("/hub/save_config", {
      api_key: apiKey,
      name: name,
      description: description,
      auction_house: auction_house,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default saveConfig;
