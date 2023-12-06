import apiClient from "/data/client/apiClient";

async function saveCurationsOrder(apiKey, curationIds) {
  try {
    const response = await apiClient.post("/user/save_curations_order", {
      api_key: apiKey,
      curation_ids: curationIds,
    }).then(res => res.data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default saveCurationsOrder;
