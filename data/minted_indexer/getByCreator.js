import apiClient from "../client/apiClient";

const getMintedIndexerByCreator = async (artistAddress) => {
  try {
    return apiClient.post("minted_indexer/get_by_creator", {
      artist_address: artistAddress,
    }).then(res => res.data)
  } catch (e) {
    console.error("Error getting minted indexer by creator address: ", e);
  }
}

export default getMintedIndexerByCreator;