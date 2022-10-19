import cloneDeep from "lodash/cloneDeep";

export function sortListings(sortType, listings) {
  const clonedListings = cloneDeep(listings);

  if (sortType === "az") {
    let results = clonedListings.sort((a, b) =>
      a.artist_name.localeCompare(b.artist_name)
    );
    return results;
  } else if (sortType === "za") {
    let results = clonedListings.sort((b, a) =>
      a.artist_name.localeCompare(b.artist_name)
    );
    return results;
  } else if (sortType === "lh") {
    let results = clonedListings.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    return results;
  } else if (sortType === "hl") {
    let results = clonedListings.sort((a, b) =>
      a.amount < b.amount ? 1 : b.amount < a.amount ? -1 : 0
    );
    return results;
  } else if (sortType === "asc") {
    let results = clonedListings.sort((a, b) =>
      a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0
    );
    return results;
  } else if (sortType === "desc") {
    let results = clonedListings.sort((a, b) =>
      a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0
    );
    return results;
  } else if (sortType === "deals") {
    for (const listing of clonedListings) {
      if (
        listing.estimate === null ||
        typeof listing.estimate === "undefined"
      ) {
        listing.ratio = +Infinity;
      } else {
        listing.ratio = listing.amount / listing.estimate;
      }
    }
    let results = clonedListings.sort((a, b) =>
      a.ratio > b.ratio ? 1 : b.ratio > a.ratio ? -1 : 0
    );
    return results;
  }
}

export function sortAuctions(sortType, auctions) {
  const clonedAuctions = cloneDeep(auctions);

  if (sortType === "az") {
    let results = clonedAuctions.sort((a, b) =>
      a.brand_name.localeCompare(b.brand_name)
    );
    return results;
  } else if (sortType === "za") {
    let results = clonedAuctions.sort((b, a) =>
      a.brand_name.localeCompare(b.brand_name)
    );
    return results;
  } else if (sortType === "lh") {
    let results = clonedAuctions.sort((a, b) => {
      if (!a.highest_bid) a.highest_bid = a.reserve;
      if (!b.highest_bid) b.highest_bid = b.reserve;
      return a.highest_bid > b.highest_bid
        ? 1
        : b.highest_bid > a.highest_bid
        ? -1
        : 0;
    });
    return results;
  } else if (sortType === "hl") {
    let results = clonedAuctions.sort((a, b) => {
      if (!a.highest_bid) a.highest_bid = a.reserve;
      if (!b.highest_bid) b.highest_bid = b.reserve;
      return a.highest_bid < b.highest_bid
        ? 1
        : b.highest_bid < a.highest_bid
        ? -1
        : 0;
    });
    return results;
  } else if (sortType === "asc") {
    let results = clonedAuctions.sort((a, b) =>
      a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0
    );
    return results;
  } else if (sortType === "desc") {
    let results = clonedAuctions.sort((a, b) =>
      a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0
    );
    return results;
  }
}
