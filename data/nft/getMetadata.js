import axios from "axios";
import apiClient from "/data/client/apiClient";
import { rpcHost } from "/config/settings";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { connection } from "/config/settings";
import hellomoonClient from "../client/helloMoonClient";
import useSWR from 'swr'

export function coalesce(val, def) {
  if (val === null || typeof val === "undefined") return def;
  return val;
}

//ONCHAIN
// async function getMetadataONCHAIN(publicKeys) {
//   var onChainResults = [];
//   var tokenAccounts = [];
//   for (const publicKey of publicKeys) {
//     const tokenMetadata = await Metadata.findDataByOwner(
//       connection,
//       new PublicKey(publicKey)
//     );
//     for (const meta of tokenMetadata) {
//       onChainResults.push({
//         mint: meta.mint,
//         name: meta.data.name,
//         uri: meta.data.uri,
//         owner: publicKey,
//         creator: meta.data.creators ? meta.data.creators[0].address : undefined,
//       });
//     }
//     // Get the tokenAccountsByOwner
//     let res = await axios.post(rpcHost, data(publicKey));
//     for (const account of res.data.result.value) {
//       let associatedTokenAccountAddress = account.pubkey;
//       let mint = account.account.data.parsed.info.mint;
//       tokenAccounts.push({
//         mint: mint,
//         associatedTokenAccountAddress: associatedTokenAccountAddress,
//       });
//     }
//   }
//   // Filter out any that don't have data uri's 
//   onChainResults = onChainResults.filter((item) => {
//     const useable = item.uri !== "" && item.creator !== undefined
//     return useable
//   });

//   // Retrieve order and visibility from the server
//   const APIresults = await apiClient.post("/get_visibility_and_order", {
//     public_key: publicKeys[0],
//     tokens: onChainResults,
//     // mints: onChainResults.map(token => token.mint),
//   }).then(res => res.data)
  
//   // const results = APIresults.mints
//   const results = APIresults.tokens

//   // Loop through results and set visibility and order
//   for (const result of results) {

//     if (!result.mint) {
//       result.mint = result.mint_address
//     }

//     // Also find the associatedTokenAccountAddress
//     let ta = tokenAccounts?.find((a) => a.mint === result.mint);
//     result.associatedTokenAccountAddress = ta?.associatedTokenAccountAddress;
//     // Add metadata address
//     const metadataPDA = await Metadata.getPDA(new PublicKey(result.mint));
//     result.address = metadataPDA.toBase58();
//   }

//   // Get creator details
//   const resp = await apiClient.post("/creator/details", {
//     tokens: results,
//   });

//   // Loop through results and set artist name, twitter
//   for (const result of results) {
//     let tokens = resp.data.filter((t) => t.public_key === result.creator);
//     if (tokens.length > 0) {
//       let token = tokens[tokens.length - 1];
//       result.artist_name = token.name;
//       result.artist_twitter = token.twitter;
//       if (result.artist_twitter === null) {
//         let toke = resp.data.find(
//           (t) => t.public_key === result.creator && t.twitter !== null
//         );
//         if (toke) result.artist_twitter = toke.twitter;
//       }
//     }
//   }
//   console.log("🚀 ~ file: getMetadata.js:102 ~ getMetadata ~ results:", results.length)
//   results = results.sort((a, b) =>
//     coalesce(a.order_id, +Infinity) > coalesce(b.order_id, +Infinity)
//       ? 1
//       : coalesce(b.order_id, +Infinity) > coalesce(a.order_id, +Infinity)
//       ? -1
//       : 0
//   );

//   return results;
// }

function data(pubKey) {
  let data = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenAccountsByOwner",
    params: [
      pubKey,
      {
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        encoding: "jsonParsed",
      },
    ],
  };
  return data;
}

//HELIUS METADATA BY OWNER
async function getMetadata(publicKeys, {
  justVisible = false,
  useArtistDetails = true
}) { 
  const baseTokens = []
  const tokenAccounts = {}
 
  const maxBatch = 1000
  for (const publicKey of publicKeys) {
    let page = 1
    let continueFetching = true
    while (continueFetching) {
      const res = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`, {
          "jsonrpc": "2.0",
          "id": `collector`,
          "method": "getAssetsByOwner",
          "params": {
            "ownerAddress": publicKey,
            "page": page,
            "limit": maxBatch
          }
        }).then((res) => {
          return res.data.result;
        }).catch((err) => {
          console.log("Error Fetching Metadata By Owner:", err);
          continueFetching = false
        });

      if (res?.total < maxBatch) {
        continueFetching = false
      } else {
        page++
      }

      baseTokens.push(...res.items)
    }

    //For now this gets picked up on detail pages seperately
    // //associated token accounts
    // let tokenAccountRes = await axios.post(rpcHost, data(publicKey));
    // for (const account of tokenAccountRes.data.result.value) {
    //   let associatedTokenAccountAddress = account.pubkey;
    //   let mint = account.account.data.parsed.info.mint;
    //   tokenAccounts[mint] = associatedTokenAccountAddress;
    // }
  }

  const mungedTokens = baseTokens.map((token) => { 
    const { content, creators, ownership, id } = token
  
    return{
      creator: creators.sort((a, b) => a.share - b.share)?.[0]?.address,
      description: content.metadata.description,
      animation_url: content.links.animation_url,
      image: content.links.image,
      mint: id,
      name: content.metadata.name,
      owner: ownership.owner,
      properties: {
        files: content.files,
        creators: creators,
      },
      symbol: content.metadata.symbol,
      uri: content.json_uri,
      attributes: content.metadata.attributes,
      royalties: token.royalties,
    }

  }).filter((item) => {
    const useable = item.uri !== "" && item.creator !== undefined
    return useable
  });

  const visResults = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
    mints: mungedTokens.map(token => token.mint),
  }).then(res => res.data)

  const { visibilities, optimizations, user_default } = visResults



  const results = []  

  for (const token of mungedTokens) {
    let result = { ...token }
    const visibility = visibilities[token.mint]
    const optimization = optimizations[token.mint]

    if (!visibility) {
      result.order_id = null;
      result.visible = false //user_default; //forcing to false 
      result.span = 1;
    } else {
      result.order_id = visibility.order_id;
      result.visible = visibility.visible;
      result.span = visibility.span;
    }

    if (optimization) {
      result.optimized = optimization.optimized;
      result.optimizationError = optimization.error_message;
    }
    
    results.push(result)
  }
  
  if (justVisible) {
    results = results.filter((r) => r.visible);
  }

  const creatorResp = useArtistDetails
    ? await apiClient.post("/creator/details", {
      tokens: results,
    })
    : { data: [] };

  for (const result of results) { 
    // Add metadata PDA address
    const metadataPDA = await Metadata.getPDA(new PublicKey(result.mint));
    result.address = metadataPDA.toBase58(); 

    // Loop through results and set artist name, twitter
    let tokens = creatorResp.data.filter((t) => t.public_key === result.creator);
    if (tokens.length > 0) {
      let token = tokens[tokens.length - 1];
      result.artist_name = token.name;
      result.artist_twitter = token.twitter;
      if (result.artist_twitter === null) {
        let toke = creatorResp.data.find(
          (t) => t.public_key === result.creator && t.twitter !== null
        );
        if (toke) result.artist_twitter = toke.twitter;
      }
    }

     //For now this gets picked up on detail pages seperately
    //associated token account
    // result.associatedTokenAccountAddress = tokenAccounts[result.mint];
  }

  results = results.sort((a, b) => {
    const aOrderId = coalesce(a.order_id, +Infinity);
    const bOrderId = coalesce(b.order_id, +Infinity);

    return aOrderId > bOrderId ? 1 : bOrderId > aOrderId ? -1 : 0;
  });

  return results;
}

//Hellomoon metadata
// async function getMetadataHELLOMOON(publicKeys) { 
//   const baseTokens = []
  

//   for (const publicKey of publicKeys) { 
//     let paginationToken = undefined
//     let requestCount = 0
//     while (requestCount === 0 || paginationToken) {
//       const res = await hellomoonClient
//         .post("/v0/nft/mints-by-owner", {
//           ownerAccount: publicKey,
//           limit: 1000,
//           paginationToken
//         })
//         // .post("/v0/nft/mint_information", { //mints by creator
//         //   verifiedCreator: publicKey,
//         //   limit: 1000,
//         //   paginationToken
//         // })
//         .then((res) => {
//           return res.data;
//         })
//         .catch((err) => {
//           console.log(err);
//         });
        
//       if (res?.paginationToken) {
//         paginationToken = res.paginationToken
//       } else {
//         paginationToken = undefined
//       }
        
//       if (res?.data) {
//         baseTokens.push(...res.data)
//       }
//       requestCount++;
//     }
//   }
//   console.log("🚀 ~ file: getMetadata.js:138 ~ getMetadata ~ baseTokens:", baseTokens.length)

//   // const visAndOrders = await apiClient.post("/get_visibility_and_order", {
//   //   public_key: publicKeys[0],
//   // });

//   const visAndOrders = await apiClient.post("/get_visibility_and_order", {
//     public_key: publicKeys[0],
//     tokens: baseTokens.map(t => ({...t, mint: t.nftMint})),
//   }).then(res => res.data)

//   const creatorDetails = await apiClient.post("/creator/details", {
//     tokens: baseTokens,
//   });

//   for(const token of baseTokens) {
    
//     const visibilityAndOrder = visAndOrders.tokens.find((m) => m.mint === token.nftMint)
//     const filteredCreatorDetails = creatorDetails.data.filter((t) => t.public_key === token.creator);
    
//     token.owner = token.ownerAccount
//     token.address = token.metadataAddress
//     token.mint = token.nftMint
//     token.name = token.metadataJson.name
//     token.uri = token.metadataJson.uri
//     token.symbol = token.metadataJson.symbol

//     if(visibilityAndOrder) {
//       token.order_id = visibilityAndOrder.order_id;
//       token.visible = visibilityAndOrder.visible;
//       token.accept_offers = visibilityAndOrder.accept_offers;
//       token.estimate = visibilityAndOrder.estimate;
//       token.span = visibilityAndOrder.span;
//       token.optimized = visibilityAndOrder.optimized;
//       token.optimizedError = visibilityAndOrder.error
//     }

//     if (filteredCreatorDetails.length > 0) {
//       const filteredCreatorDetail = filteredCreatorDetails[filteredCreatorDetails.length - 1];
//       token.artist_name = filteredCreatorDetail.name;
//       token.artist_twitter = filteredCreatorDetail.twitter;
//       if (token.artist_twitter === null) {
//         const filteredCreatorDetail = creatorDetails.data.find(
//           (t) => t.public_key === token.creator && t.twitter !== null
//         );
//         if (filteredCreatorDetail) token.artist_twitter = filteredCreatorDetail.twitter;
//       }
//     }

//   }
//   // TODO find associatedTokenAccountAddress with hello moon here or find it at time of use
    
//   console.log("🚀 ~ file: getMetadata.js:222 ~ getMetadata ~ baseTokens:", baseTokens.length)
//   return baseTokens.sort((a, b) =>
//     coalesce(a.order_id, +Infinity) > coalesce(b.order_id, +Infinity)
//       ? 1
//       : coalesce(b.order_id, +Infinity) > coalesce(a.order_id, +Infinity)
//         ? -1
//         : 0
//   );
// }

export default getMetadata;

const fetcher = async ({ publicKeys, options }) => {
  if(!publicKeys) return undefined
  return await getMetadata(publicKeys, options)
}
export function useMetadata(publicKeys, options) {
  const { data: tokens, error } = useSWR({ publicKeys, options }, fetcher)
  return tokens
}

//TOKEN
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
// }
///

//HELIUS
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

//HELLOMOON
// {
//   helloMoonCollectionId:null
//   metadataAddress:"7qzfwwGzm2hk1krNJJwcsCB51wNMrYvtt5uCsAaFgPN5"
//   metadataJson: {
//     creators: (2)[{… }, {… }]
//     name: "A Martian Place"
//     sellerFeeBasisPoints: 800
//     symbol: "SKULL"
//     uri: "https://arweave.net/Yh0z-LWY_42B5AslSLTbXUlflLqI89wZC9bQxxdCgH4"
//   }
//   nftCollectionMint:null
//   nftMint:"RR4ypziMETKtRv8ivEbuVjCMdM4qa2t53yjCQDk93F6"
//   ownerAccount:"EZAdWMUWCKSPH6r6yNysspQsZULwT9zZPqQzRhrUNwDX"
//   verifiedCreators:null
// }