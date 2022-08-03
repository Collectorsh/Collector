import cloneDeep from "lodash/cloneDeep";

export function sortHighestOffer(offers) {
  const clonedOffers = cloneDeep(offers);
  let results = clonedOffers.filter(
    (o) =>
      o.auctionHouse &&
      o.auctionHouse.address === process.env.NEXT_PUBLIC_AUCTIONHOUSE
  );
  let highest = results.sort((a, b) => b.price - a.price)[0];
  return highest;
}
