import apiClient from "../client/apiClient";

async function updateCurationName({ newName, name, apiKey, curationId }) {
  try {
    let res = await apiClient.post("/curation/update_name", {
      new_name: newName,
      name: name,
      api_key: apiKey,
      curation_id: curationId
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default updateCurationName;

export async function checkCurationNameAvailability(name, curatorId) {
  try {
    let res = await apiClient.post("/curation/check_name_availability", {
      new_name: name,
      curator_id: curatorId
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}