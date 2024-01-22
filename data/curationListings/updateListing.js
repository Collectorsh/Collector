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

export async function updateListingStatus({ apiKey, curationId,tokenMint,ownerAddress, listedStatus, nftState }) {
  try {
    let res = await apiClient.post("/curation_listing/update_listing_status", {
      api_key: apiKey,
      curation_id: curationId,
      token_mint: tokenMint,
      owner_address: ownerAddress,
      listed_status: listedStatus,
      nft_state: nftState
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
