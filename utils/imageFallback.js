import axios from "axios";
import hellomoonClient from "../data/client/helloMoonClient";
import apiClient, { apiClientLong } from "../data/client/apiClient";

export default async function ImageFallback(mint) {
  try {
    const image = await HandleNoUrl(mint)
    if (!image) throw new Error("No image found")
    
    const cloudinary = await HandleUpload(image, mint)

    return cloudinary.public_id;
  } catch (error) {
    console.log("Error checking image type", error);
  }
}

export async function OptimizeWithMints(mints, username) {
  if(!mints.length) return;
  try {
    const cloudinaryUploads = await apiClient.post("/images/upload_with_mints", {
      mints,
      username
    }).then(res => res.data)

    return cloudinaryUploads;
  } catch (error) {
    console.log("Error uploading with mints", error);
  }
}

export async function HandleNoUrl(mint) {
  try {
    const nftURI = await hellomoonClient.post("/v0/nft/mint_information", {
      nftMint: mint,
    }).then(res => res.data.data[0].nftMetadataJson.uri)

    const metadata = await axios.get(nftURI).then(res => res.data)
    return metadata.image;
  } catch (e) {
    console.log("error getting metadata in image fallback", e)
  }
}

export async function HandleUpload(content, mint) { 
  try {
    const result = await axios.post("/api/uploadContent", {
      content, 
      mint
    }).then(res => res.data)
    return result;
  } catch (error) {
    console.log("Error uploading image", error);
  }
}

// export async function DoubleCheckCloudinaryExists(url) {
//   try {
//     const result = await axios.get(url).then(res => res.data)
//     if (Boolean(result)) return true
//   } catch (e) {
//     console.log(`Error with cloudinary url: ${url}`, e)
//   }
//   return false
// }