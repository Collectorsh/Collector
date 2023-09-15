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

  //TODO if parent is available from helius then use that instead of image, 
  //and add is_master_edition to the check(they would be the parent)

  //MAKE SURE TO CHANGE THIS IN THE API AS WELL in image service
  return ((token.is_edition) && token.image)
    ? `edition-${ clean(token.image) }`
    : token.mint
}