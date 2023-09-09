import apiClient from "../client/apiClient";

async function getCurationsByListingMint(mint) {
  try {
    let res = await apiClient.post("/curation/get_by_listing_mint", {
      mint,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getCurationsByListingMint;