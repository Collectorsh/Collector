import apiClient from "/data/client/apiClient";

async function getListingUsernames(nfts) {
  try {
    const res = await apiClient.post("/listing/usernames", { nfts: nfts });
    const results = res.data["nfts"].filter((nft) =>
      nft.listings.filter((l) => l.username)
    );
    return results;
  } catch (err) {
    console.log(err);
  }
}

export default getListingUsernames;
