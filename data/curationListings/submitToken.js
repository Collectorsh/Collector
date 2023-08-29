import apiClient from "../client/apiClient";

export async function submitSingleToken({
  token,
  apiKey,
  curationId,
  aspectRatio,
  ownerId,
  artistId
}) {
  try {
    const res = await apiClient.post("/curation_listing/submit_single_token", {
      token_mint: token.mint,
      is_edition: token.is_edition,
      api_key: apiKey,
      curation_id: curationId,
      aspect_ratio: aspectRatio,
      owner_id: ownerId,
      owner_address: token.owner,
      artist_id: artistId,
      artist_address: token.creator,
      name: token.name,
      animation_url: token.animation_url,
      image: token.image,
      description: token.description,
      is_primary_sale: !token.primary_sale_happened,
      creators: token.creators,
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
