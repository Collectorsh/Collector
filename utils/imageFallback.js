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

export async function OptimizeWithMints(mints, socket_id) {
  if(!mints.length) return;
  try {
    const cloudinaryUploads = await apiClient.post("/images/upload_with_mints", {
      mints,
      socket_id //change key to socket_id too
    }).then(res => res.data)

    return cloudinaryUploads;
  } catch (error) {
    console.log("Error uploading with mints", error);
  }
} 
export async function OptimizeSingleMint(mint, socket_id) {
  if (!mint) return;
  try {
    const cloudinaryUploads = await apiClient.post("/images/upload_single_mint", {
      mint,
      socket_id //change key to socket_id too
    }).then(res => res.data)

    return cloudinaryUploads;
  } catch (error) {
    console.log("Error uploading with mints", error);
  }
}


export async function OptimizeWithTokens(tokens, socket_id) {
  if (!tokens.length) return;
  try {
    //"tokens" must include "image" url and "mint" with mint address
    const cloudinaryUploads = await apiClient.post("/images/upload_with_tokens", {
      tokens,
      socket_id //change key to socket_id too
    }).then(res => res.data)

    return cloudinaryUploads;
  } catch (error) {
    console.log("Error uploading with mints", error);
  }
}

export async function HandleNoUrl(mint) {
  console.log("NOR UR: MINT")
  try {
    const image = axios.post(`https://api.helius.xyz/v0/token-metadata?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
      {
        mintAccounts: [mint],
        includeOffChain: true
      }
    ).then(res => res.data?.[0]?.offChainMetadata?.metadata?.image)

    return image
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
