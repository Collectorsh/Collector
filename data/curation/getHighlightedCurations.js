import apiClient from "../client/apiClient";

async function getHighlightedCurations() {
  try {
    let res = await apiClient.get("/curation/get_highlighted_curations");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getHighlightedCurations;