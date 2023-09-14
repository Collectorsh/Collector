import { Cloudinary } from "@cloudinary/url-gen";
import { dpr } from "@cloudinary/url-gen/actions/delivery";


const cloudinaryCloud = new Cloudinary({
  cloud: {
    cloudName: 'dukxp13zq'
  }
});

export default cloudinaryCloud

export const baseCloudImageUrl = (id) => {
  const cldImg = cloudinaryCloud.image(id)
  return cldImg.toURL()
}