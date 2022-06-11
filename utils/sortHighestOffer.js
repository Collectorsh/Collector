import cloneDeep from "lodash/cloneDeep";

export function sortHighestOffer(offers) {
  const clonedOffers = cloneDeep(offers);
  let highest = clonedOffers.sort((a, b) => b.price - a.price)[0];
  return highest;
}
