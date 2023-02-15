import apiClient from "/data/client/apiClient";

async function getDropFromName(name) {
  try {
    let res = await apiClient.post("/drops/from_name", {
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getDropFromName;
