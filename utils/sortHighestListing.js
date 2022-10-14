import { auctionHousesArray } from "/config/settings";
import cloneDeep from "lodash/cloneDeep";

export function sortHighestListing(token, listings) {
  const clonedListings = cloneDeep(listings);
  let results = clonedListings.filter(
    (l) =>
      l.seller === token.owner &&
      l.auctionHouse &&
      auctionHousesArray.map((a) => a.address).includes(l.auctionHouse.address)
  );
  if (results) {
    let highest = results.sort((a, b) => b.price - a.price)[0];
    return highest;
  } else {
    return null;
  }
}
