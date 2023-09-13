import apiClient from "../client/apiClient";

async function updateCurationName({ newName, name, apiKey }) {
  try {
    let res = await apiClient.post("/curation/update_name", {
      new_name: newName,
      name: name,
      api_key: apiKey
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default updateCurationName;

export async function checkCurationNameAvailability(name) {
  try {
    let res = await apiClient.post("/curation/check_name_availability", {
      new_name: name
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}