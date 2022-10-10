export function sortListings(sortType, listings) {
  if (sortType === "az") {
    let results = listings.sort((a, b) =>
      a.artist_name > b.artist_name ? 1 : b.artist_name > a.artist_name ? -1 : 0
    );
    return results;
  } else if (sortType === "za") {
    let results = listings.sort((a, b) =>
      a.artist_name < b.artist_name ? 1 : b.artist_name < a.artist_name ? -1 : 0
    );
    return results;
  } else if (sortType === "lh") {
    let results = listings.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    return results;
  } else if (sortType === "hl") {
    let results = listings.sort((a, b) =>
      a.amount < b.amount ? 1 : b.amount < a.amount ? -1 : 0
    );
    return results;
  } else if (sortType === "deals") {
    for (const listing of listings) {
      if (
        listing.estimate === null ||
        typeof listing.estimate === "undefined"
      ) {
        listing.ratio = +Infinity;
      } else {
        listing.ratio = listing.amount / listing.estimate;
      }
    }
    let results = listings.sort((a, b) =>
      a.ratio > b.ratio ? 1 : b.ratio > a.ratio ? -1 : 0
    );
    return results;
  }
}
