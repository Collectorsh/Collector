export function marketplaceLink(
  source,
  mint,
  brand_name = null,
  username = null
) {
  if (source === "holaplex") {
    return `https://${brand_name}.holaplex.com/listings/${mint}`;
  }
  if (source === "exchange") {
    return `https://exchange.art/single/${mint}`;
  }
  if (source === "formfunction" && username) {
    return `https://formfunction.xyz/@${username}/${mint}`;
  }
  if (source === "formfunction" && !username) {
    return `https://formfunction.xyz/@/${mint}`;
  }
  if (source === "collector") {
    return `/nft/${mint}`;
  }
  if (source === "magiceden") {
    return `https://magiceden.io/item-details/${mint}`;
  }
}
