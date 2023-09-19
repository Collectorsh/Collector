import axios from "axios";
import apiClient from "../client/apiClient";

// return axios.post("/api/uploadImage", {
export default async function uploadCldImage({ imageBuffer, cldId }) { 
  if (!Buffer.isBuffer(imageBuffer)) return console.log("Invalid image buffer");

  const base64String = imageBuffer?.toString('base64');


  return apiClient.post("/images/upload_image_buffer", {
    image_buffer: base64String,
    cld_id: cldId
  }).then(res => res.data)
  .catch(error => console.log("Error uploading image", error.message))
}