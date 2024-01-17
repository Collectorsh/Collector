import { Metaplex } from "@metaplex-foundation/js";
import apiClient from "../client/apiClient";
import { connection } from "../../config/settings";
import { PublicKey } from "@solana/web3.js";

async function getListingsByParent(mint) {
  try {
    const metaplex = Metaplex.make(connection);
    const mintPubkey = new PublicKey(mint);
    const parentAddress = metaplex.nfts().pdas().masterEdition({ mint: mintPubkey })

    const res = await apiClient.post("/curation_listing/get_listings_by_parent", {
      parent: parentAddress?.toString(),
    })

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getListingsByParent
