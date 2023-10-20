import apiClient from "../client/apiClient";

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

export default createMintedIndex;