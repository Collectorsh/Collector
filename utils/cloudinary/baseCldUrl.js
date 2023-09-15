import cloudinaryCloud from "../../data/client/cloudinary"

export const baseCloudImageUrl = (id) => {
  const cldImg = cloudinaryCloud.image(id)
  return cldImg.toURL()
}