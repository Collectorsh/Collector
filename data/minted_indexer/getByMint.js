import apiClient from "../client/apiClient";

const getMintedIndexerByMint= async (mintAddress) => {
  try {
    return apiClient.post("minted_indexer/get_by_mint", {
      mint: mintAddress,
    }).then(res => res.data)
  } catch (e) {
    console.error("Error getting minted indexer by mint address: ", e);
  }
}

export default getMintedIndexerByMint;