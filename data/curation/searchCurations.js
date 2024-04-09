import apiClient from "../client/apiClient";

export async function searchPublishedCurations(search) {
  try {
    let res = await apiClient.post("/curation/search_published", {
      search: search,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}