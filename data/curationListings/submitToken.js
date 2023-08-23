import apiClient from "../client/apiClient";

async function submitToken({
  token,
  apiKey,
  curationId,
  aspectRatio,
  ownerId,
  artistId
}) {
  try {
    const res = await apiClient.post("/curation_listing/submit_token", {
      api_key: apiKey,
      curation_id: curationId,
      aspect_ratio: aspectRatio,
      owner_id: ownerId,
      owner_address: token.owner,
      artist_id: artistId,
      artist_address: token.creator,
      name: token.name,
      token_mint: token.mint,
      animation_url: token.animation_url,
      image: token.image,
      description: token.description,
      is_primary_sale: !token.primarySaleHappened
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default submitToken;