import apiClient from "../client/apiClient";

async function recordSale({
  apiKey,
  curationId,
  token, //item from curation_listings table
  buyerId,
  buyerAddress,
  saleType,
  txHash,
  editionsMinted,
  newSupply
}) {
  try {
    if (!txHash) throw new Error("txHash is required");
    
    let res = await apiClient.post("/sales_history/record_sale", {
      api_key: apiKey,
      token_mint: token.mint,
      curation_id: curationId,
      price: token.buy_now_price,
      is_primary_sale: !token.primary_sale_happened,
      sale_type: saleType,
      tx_hash: txHash,
      buyer_id: buyerId,
      buyer_address: buyerAddress,
      seller_id: token.owner_id,
      seller_address: token.owner_address,
      editions_minted: editionsMinted,
      new_supply: newSupply
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default recordSale;