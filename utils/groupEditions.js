export const groupEditions = (editions) => {
  const reduced = editions.reduce((acc, edition) => {
    // const key = edition.parent
    const key = edition.image
    const copy = {...edition}
    if (!key) {
      console.error("No key for edition: ", copy)
      return acc;
    }
    if (!acc[key]) {
      copy.editions = [edition] //use original in array so its not a circular reference
      acc[key] = copy
    } else {
      acc[key].editions.push(edition)
    }
    return acc
  }, {})
  return Object.values(reduced)
}

export const groupCompressed = (cNFTs) => {
  const reduced = cNFTs.reduce((acc, compressedNFT) => {
    // const key = compressedNFT.parent
    const key = compressedNFT.image
    const copy = { ...compressedNFT }
    if (!key) {
      console.error("No key for compressedNFT: ", copy)
      return acc;
    }
    if (!acc[key]) {
      copy.cNFTs = [compressedNFT] //use original in array so its not a circular reference
      acc[key] = copy
    } else {
      acc[key].cNFTs.push(compressedNFT)
    }
    return acc
  }, {})
  return Object.values(reduced)
}