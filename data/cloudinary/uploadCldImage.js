import apiClient from "../client/apiClient";

export default async function uploadCldImage({ imageBuffer, cldId }) { 
  return apiClient.post("/images/upload_image_buffer", {
    image_buffer: imageBuffer,
    cld_id: cldId
  }).then(res => res.data)
  .catch(error => console.log("Error uploading image", error.message))
}