import apiClient from "../client/apiClient";

async function recordSale({
  apiKey,
  curationId,
  token, //item from curation_listings table
  buyerId,
  buyerAddress,
  saleType,
  txHash
}) {
  try {
    let res = await apiClient.post("/sales_history/record_sale", {
      api_key: apiKey,
      token_mint: token.mint,
      curation_id: curationId,
      price: token.buy_now_price,
      is_primary_sale: token.is_primary_sale,
      sale_type: saleType,
      tx_hash: txHash,
      token_name: token.name,
      buyer_id: buyerId,
      buyer_address: buyerAddress,
      seller_id: token.owner_id,
      seller_address: token.owner_address,
      artist_id: token.artist_id,
      artist_address: token.artist_address,
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default recordSale;