import { auctionHousesArray } from "/config/settings";
import cloneDeep from "lodash/cloneDeep";

export function sortHighestOffer(offers) {
  const clonedOffers = cloneDeep(offers);
  let results = clonedOffers.filter(
    (o) =>
      o.auctionHouse &&
      auctionHousesArray.map((a) => a.address).includes(o.auctionHouse.address)
  );
  let highest = results.sort((a, b) => b.price - a.price)[0];
  return highest;
}
