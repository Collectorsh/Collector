import apiClient from "/data/client/apiClient";

async function getListingsFromMints(mints) {
  try {
    const res = await apiClient.post("/listing/mints", { mints: mints });
    return res;
  } catch (err) {
    console.log(err);
  }
}

export default getListingsFromMints;
