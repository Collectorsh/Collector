import axios from "axios";
import hellomoonClient from "../data/client/helloMoonClient";

export default async function ImageFallback(imageUrl, mint) {
  if (imageUrl) {
    //check if image is valid
    try {
      const image = (typeof imageUrl === "string") ? imageUrl : imageUrl.image;
      const urlType = await axios.post("/api/checkContent", {
        urls: [image],
      }).then(res => res.data[0])
      console.log("🚀 ~ file: imageFallback.js:11 ~ ImageFallback ~ urlType:", urlType)

      if (urlType.fileType === "image") return imageUrl;
    } catch (error) {
      console.log("Error checking image type", error);
    }
  }

  return handleNoUrl(mint);
}

async function handleNoUrl(mint) {
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