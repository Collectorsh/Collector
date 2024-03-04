import apiClient from "../client/apiClient";

export async function getHighlightedCurations() {
  try {
    let res = await apiClient.get("/curation/get_highlighted_curations");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLatestCurations() {
  try {
    let res = await apiClient.get("/curation/get_latest_curations");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}