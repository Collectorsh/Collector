import { auctionHousesArray } from "/config/settings";
import cloneDeep from "lodash/cloneDeep";

export function sortHighestListing(token, listings) {
  const clonedListings = cloneDeep(listings);
  let results = clonedListings.filter((l) => l.seller === token.owner);
  if (results) {
    let highest = results.sort((a, b) => b.price - a.price)[0];
    return highest;
  } else {
    return null;
  }
}
