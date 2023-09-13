import apiClient from "../client/apiClient";

async function updateListing({ apiKey, tokenMint, buyNowPrice, curationId, listingReceipt, editionMarketAddress }) {
  try {
    let res = await apiClient.post("/curation_listing/update_listing", {
      api_key: apiKey,
      curation_id: curationId,
      token_mint: tokenMint,
      buy_now_price: buyNowPrice,
      listing_receipt: listingReceipt,
      master_edition_market_address: editionMarketAddress
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default updateListing;

export async function cancelListing({ apiKey, tokenMint, curationId }) {
  try {
    let res = await apiClient.post("/curation_listing/cancel_listing", {
      curation_id: curationId,
      api_key: apiKey,
      token_mint: tokenMint,
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
