import axios from "axios";
import apiClient from "/data/client/apiClient";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import useSWR from 'swr'
import { connection } from "../../config/settings";


const DEBUG = false

//HELIUS METADATA BY Mint
async function getTokenByMint(tokenMint) {
  DEBUG && console.time("getTokenByMint Time")

  const token = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`, {
    "jsonrpc": "2.0",
    "id": `collector token ${ tokenMint }`,
    "method": "getAsset",
    "params": {
      "id": tokenMint
    }
  }).then((res) => {
    return res.data.result;
  }).catch((err) => {
    console.log("Error Fetching Token Metadata by Mint:", err);
    continueFetching = false
  });
    
  const { content, creators, ownership, id } = token
  const mungedToken = {
    creator: creators[0]?.address,
    description: content.metadata.description,
    animation_url: content.links?.animation_url,
    image: content.links.image,
    mint: id,
    name: content.metadata.name,
    owner: ownership.owner,
    files: content.files,
    creators: creators,
    symbol: content.metadata.symbol,
    uri: content.json_uri,
    attributes: content.metadata?.attributes,
    royalties: token.royalty,
    primary_sale_happened: token.royalty?.primary_sale_happened,
    //TODO Get from Helius when available and remove seperate edition call
    // is_edition: 
    // parent:
    // is_master_edition:
    // supply:
    // max_supply:
  }
 
  try {
    const edition = await Metadata.getEdition(connection, mungedToken.mint)
    const { data } = edition
    
    mungedToken.is_master_edition = data.maxSupply && Number(data.maxSupply?.toString()) > 0
    mungedToken.supply = data.supply ? Number(data.supply.toString()) : undefined
    mungedToken.max_supply = data.maxSupply ? Number(data.maxSupply.toString()) : undefined
    
    mungedToken.is_edition = Boolean(data.parent)
    mungedToken.parent = data.parent?.toString()
  } catch (err) {
    console.log("Error getting metadata for mint", mungedToken.mint)
  }

  const artist_res = await apiClient.post("/user/get_user_by_address",
    { address: mungedToken.creator }
  ).then((res) => res.data)

  if (artist_res?.status === "success") {
    const artist = artist_res.user
    mungedToken.artist_name = artist.username;
    mungedToken.artist_account = artist
  } else {
    const creatorsDetails = await apiClient.post("/creator/details", {
      tokens: [mungedToken],
    }).then((res) => res.data)
  
    if (creatorsDetails.length > 0) {
      const detail = creatorsDetails[creatorsDetails.length - 1];
      mungedToken.artist_name = detail.name;
      mungedToken.artist_twitter =detail.twitter;
    }
  }

  DEBUG && console.timeEnd("getTokenByMint Time")
  return mungedToken;
}

export default getTokenByMint;

const fetcher = async (mint) => {
  return getTokenByMint(mint)
}
export function useTokenByMint(mint) {
  const { data: token, error } = useSWR(mint, fetcher)
  return token
}

//COLLECTOR TOKEN
// {
//   accept_offers: null
//   address: "4TWMziS38zrgAsVMiNjFXF6iWtkXymXwz8vyS5xu5XHR"
//   animation_url: null
//   artist_name: "gtsiliakos"
//   artist_twitter: null
//   associatedTokenAccountAddress: "FxbhRhNQk1uZrdzDHJMvv17rAW2KEs4S2d41mZB9jCpr"
//   creator: "8rACaE9rmCXADofx7cHReAdCiyhadgzQ15GVFrxvrxYo"
//   description: "#03"
//   estimate: null
//   image: "https://arweave.net/FSd-SD-Gc18wJPZcGEtJnM2Po6pdRxIHgwfAArrYNqU?ext=png"
//   mint: "97YJVH2id6JvAVEzzTzK4HcjDdSqdhcq56KnCVuvudTx"
//   name: "SoC #03"
//   order_id: 1
//   owner: "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"
//   properties: { category: 'image', creators: Array(1), files: Array(1) }
//   span: 1
//   symbol: null
//   uri: "https://arweave.net/7mFIohLnmRGtmyT95ohcGuGJ-zgf9jL8c2QHjTESiRU"
//   visible: true
//   optimized: boolean
//   optimization_error: string
//   is_edition: 
//   parent:
//   is_master_edition:
//   supply:
//   max_supply:
// }
///

//HELIUS TOKEN
// {
//   "interface": "Custom",
//     "id": "ELADJs5XZpFvMFmercRRXrsQhRq74o1k9HZC6rTDDktZ",
//       "content": {
//     "$schema": "https://schema.metaplex.com/nft1.0.json",
//       "json_uri": "https://arweave.net/GeSNDlJKCsFE7eQImDpbUTJE2sxuBJXfoXEKqosOhP0",
//         "files": [
//           {
//             "uri": "https://arweave.net/4ALHkBCbGPwqCyaafGMsp1mMfiOzHvQZ-5FKAdpeVII?ext=png",
//             "cdn_uri": "https://cdn.helius.services/cdn-cgi/image//https://arweave.net/4ALHkBCbGPwqCyaafGMsp1mMfiOzHvQZ-5FKAdpeVII?ext=png",
//             "mime": "image/png"
//           },
//           {
//             "uri": "https://arweave.net/4LJSqYTZ79DBFzZridh5x0GQCZHu1LvpVAqmBgeLH9E?ext=html",
//             "mime": "text/html"
//           }
//         ],
//           "metadata": {
//       "attributes": [],
//         "description": "Snake on Solana by Nate Solomon\n\nNFTs are more than JPEGs ",
//           "name": "Snake on Solana ",
//             "symbol": ""
//     },
//     "links": {
//       "image": "https://arweave.net/4ALHkBCbGPwqCyaafGMsp1mMfiOzHvQZ-5FKAdpeVII?ext=png",
//         "animation_url": "https://arweave.net/4LJSqYTZ79DBFzZridh5x0GQCZHu1LvpVAqmBgeLH9E?ext=html"
//     }
//   },
//   "authorities": [
//     {
//       "address": "7wAdUmdWN1CmWhk85pTX61Tuvsyr8SUjU6orDjTxGNPT",
//       "scopes": [
//         "full"
//       ]
//     }
//   ],
//     "compression": {
//     "eligible": false,
//       "compressed": false,
//         "data_hash": "",
//           "creator_hash": "",
//             "asset_hash": "",
//               "tree": "",
//                 "seq": 0,
//                   "leaf_id": 0
//   },
//   "grouping": [],
//     "royalty": {
//     "royalty_model": "creators",
//       "target": null,
//         "percent": 0.1,
//           "basis_points": 1000,
//             "primary_sale_happened": false,
//               "locked": false
//   },
//   "creators": [
//     {
//       "address": "3sSaxsDthaDVrUJQ6h1kVPCfvasoJFsG4Dbvi1LL8fPk",
//       "share": 100,
//       "verified": true
//     }
//   ],
//     "ownership": {
//     "frozen": false,
//       "delegated": false,
//         "delegate": null,
//           "ownership_model": "single",
//             "owner": "EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"
//   },
//   "supply": null,
//     "mutable": false,
//       "burnt": false
// },

