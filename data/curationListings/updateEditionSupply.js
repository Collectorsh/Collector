const { default: apiClient } = require("../client/apiClient");


export async function updateEditionListing({ token, supply, apiKey }) {
  try {
    let res = await apiClient.post("/curation_listing/update_edition_supply", {
      api_key: apiKey,
      supply: supply,
      token: token,
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}