export const customIdPrefix = "user-uploaded"

export const isCustomId = (id) => {
  if (!id || typeof id !== "string") return false
  return id.startsWith(customIdPrefix)
}
export const getNftImageIdWithFolder = (id) => `${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ id }`

export const parseCloudImageId = (id) => {
  if (!id || typeof id !== "string") return null
  return isCustomId(id) ? id : getNftImageIdWithFolder(id)
}

//remove special characters and https/http from images link to use as an identifier 
const clean = (text) => text.replace(/[^\w]/g, '').replace("https", "").replace("http", "");

export const getTokenCldImageId = (token) => {
  if (!token || !token.mint) return null

  //If changing - MAKE SURE TO CHANGE THIS IN THE API AS WELL in image service
  if (token.is_edition) {
    if (token.parent) return token.parent;
    if (token.image) return `edition-${ clean(token.image) }`
  }

  if (token.compressed) {
    if (token.image) return `compressed-${ clean(token.image) }`
  }

  return token.mint
}