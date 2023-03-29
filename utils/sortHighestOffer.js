import { auctionHousesArray } from "/config/settings";
import cloneDeep from "lodash/cloneDeep";

export function sortHighestOffer(offers) {
  const clonedOffers = cloneDeep(offers);
  let results = clonedOffers;
  let highest = results.sort((a, b) => b.price - a.price)[0];
  return highest;
}
