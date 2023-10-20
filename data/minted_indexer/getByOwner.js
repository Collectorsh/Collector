import apiClient from "../client/apiClient";

const getMintedIndexerByOwner = async (ownerAddress) => { 
  try {
    return apiClient.post("minted_indexer/get_by_owner", {
      owner_address: ownerAddress,
    }).then(res => res.data) 
    //returns {status, mints}
  } catch (e) {
    console.error("Error getting minted indexer by owner address: ", e);
  }
}

export default getMintedIndexerByOwner;