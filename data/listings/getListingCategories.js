import apiClient from "/data/client/apiClient";

async function getListingCategories(nfts) {
  try {
    const res = await apiClient.post("/listing/categories", { nfts: nfts });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getListingCategories;
