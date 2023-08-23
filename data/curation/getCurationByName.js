import apiClient from "../client/apiClient";

async function getCurationByName(name) {
  try {
    let res = await apiClient.post("/curation/get_by_name", {
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getCurationByName;