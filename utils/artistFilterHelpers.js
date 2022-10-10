export function nameOpts(ArtistData) {
  const artist_names = new Set();
  for (const artist of ArtistData) {
    if (artist.name !== undefined) {
      artist_names.add(artist.name);
    }
  }
  const nameOpt = [];
  for (const artist of Array.from(artist_names)) {
    let obj = {};
    obj["label"] = artist;
    obj["value"] = artist;
    nameOpt.push(obj);
  }
  return nameOpt;
}

export function searchResultSet(ArtistData, searchNames) {
  var results = [];
  if (searchNames.length === 0) {
    results = ArtistData;
  } else {
    for (const sel of searchNames) {
      console.log(sel["label"]);
      const items = ArtistData.filter(
        (item) =>
          (item.artist || item.artist_name || item.brand_name) === sel["label"]
      );
      for (const item of items) {
        results.push(item);
      }
    }
  }
  return results;
}
