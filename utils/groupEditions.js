export const groupEditions = (editions) => {
  const reduced = editions.reduce((acc, edition) => {
    const key = edition.parent
    const copy = {...edition}
    if (!key) {
      console.error("No parent for edition: ", copy)
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