import apiClient from "../client/apiClient";

async function getListedItem(tokenMint) {
  try {
    let res = await apiClient.post("/curation_listing/get_listed_item", {
      token_mint: tokenMint,
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getListedItem;
