import apiClient from "../client/apiClient";

//assumes owner is creating a new token
const createMintedIndex = async (user, token) => {
  try {
    return apiClient.post("minted_indexer/create", {
      api_key: user.api_key,
      owner_id: user.id,
      artist_id: user.id,
      token,
    }).then(res => res.data) 
    
  } catch (e) {
    console.error("Error indexing mint: ", e);
  }
}

// uploads existing token to minted indexer
export const createIndex = async ({ apiKey, artistId, ownerId, token }) => {
  try {
    return apiClient.post("minted_indexer/create", {
      api_key: apiKey,
      owner_id: ownerId,
      artist_id: artistId,
      token,
    }).then(res => res.data)

  } catch (e) {
    console.error("Error indexing mint: ", e);
  }
}

export default createMintedIndex;