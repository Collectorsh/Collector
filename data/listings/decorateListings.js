import apiClient from "/data/client/apiClient";

async function decorateListings(nfts) {
  try {
    const res = await apiClient.post("/listing/decorate", { nfts: nfts });
    const results = res.data["nfts"].filter((nft) =>
      nft.listings.filter((l) => l.username)
    );
    return results;
  } catch (err) {
    console.log(err);
  }
}

export default decorateListings;
