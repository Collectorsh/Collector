import { Metaplex } from "@metaplex-foundation/js";
import { connection } from "../../config/settings";
import { PublicKey } from "@solana/web3.js";
import { altFileAspectRatio, getAltFileTypes } from "../../hooks/useNftFiles";
import { OptimizeSingleToken } from "../../utils/imageFallback";
import apiClient from "../client/apiClient";

export const UpdateMetadata = async (tokenMint) => {
  //Munge token data
  const token = {
    mint: tokenMint
  }
  const mintPublicKey = new PublicKey(tokenMint)

  const metaplex = new Metaplex(connection)
  const metadata = await metaplex.nfts().findByMint({
    mintAddress: mintPublicKey
  })
  
  token.name = metadata.name
  token.description = metadata.json.description
  token.image = metadata.json.image
  token.animation_url = metadata.json.animation_url
  token.primary_sale_happened = metadata.primarySaleHappened
  token.royalties = metadata.sellerFeeBasisPoints
  token.files = metadata.json.properties.files
  token.creators = metadata.creators.map((creator) => ({
    ...creator,
    address: creator.address.toString()
  }))
  token.artist_address = token.creators[0]?.address

  token.is_collection_nft = Boolean(metadata.collectionDetails);
  
  const edition = metadata.edition
  token.is_master_edition = Boolean(edition.maxSupply && Number(edition.maxSupply?.toString()) > 0)
  token.supply = edition.supply ? Number(edition.supply.toString()) : undefined
  token.max_supply = edition.maxSupply ? Number(edition.maxSupply.toString()) : undefined

  token.is_edition = !edition.isOriginal
  token.parent = edition.parent?.toString()
  token.edition_number = edition.number?.toString()

  //master editions that are listed have a different owner on chain, but we want to keep the artist as the owner in our system
  if (token.is_master_edition) {
    token.owner_address = token.artist_address
  } else {
    try {
      const largestAccounts = await connection.getTokenLargestAccounts(mintPublicKey);
      const metadataAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address);
      const owner = metadataAccountInfo.value.data.parsed.info.owner
  
      token.owner_address = owner;
  
    } catch (err) {
      console.log("Error fetching owner", err)
      return
    }
  }


  const aspectRatio = await getAspectRatio(token)
  token.aspect_ratio = aspectRatio

  //Update image cache
  const optimizeRes = await OptimizeSingleToken(token)

  //Update listings and indexer 
  try {
    const listingRes = await apiClient.post("curation_listing/update_listing_metadata", { token });
    const indexRes = await apiClient.post("minted_indexer/update_metadata", { token })

    return token
  } catch (err) {
    console.log("Error updating metadata", err)
  }
} 

const getAspectRatio = async (token) => {
  const { videoUrl } = getAltFileTypes(token)
  try {
    if (videoUrl) {
      //fetch video dimensions
      const video = document.createElement("video")

      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve(Number(video.videoWidth / video.videoHeight))
        video.onerror = (err) => reject(new Error(`Unable to load video - ${ err }`));
        video.src = videoUrl
        video.load()
      });
    } else {
      //get from image
      const imageElement = document.createElement("img")
      imageElement.src = token.image
      await imageElement.decode()
      return Number(imageElement.naturalWidth / imageElement.naturalHeight)
    }
  } catch (err) {
    console.log("Error fetching non-image dimensions: ", err)
  }
}