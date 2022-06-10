import cloneDeep from "lodash/cloneDeep";

export function sortHighestOffer(offers) {
  console.log(offers);
  const clonedOffers = cloneDeep(offers);
  let highest = clonedOffers.sort((a, b) => b.price - a.price)[0];
  return highest;
}
