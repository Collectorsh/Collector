import axios from "axios";
import apiClient from "/data/client/apiClient";
import { Metadata, Edition, MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import useSWR from 'swr'
import { getTokenCldImageId } from "../../components/CloudinaryImage";
import { connection } from "../../config/settings";
import { Metaplex } from "@metaplex-foundation/js";

export function coalesce(val, def) {
  if (val === null || typeof val === "undefined") return def;
  return val;
}

const DEBUG = false

//HELIUS METADATA BY OWNER
async function getTokens(publicKeys, options) { 
  DEBUG && console.time("getTokens Time")
  //set defaults when not provided the options object (must use ??)
  const justVisible = options.justVisible ?? false
  const useArtistDetails = options.useArtistDetails ?? true
  const justCreator = options.justCreator ?? false
  const useTokenMetadata = options.useTokenMetadata ?? false

  const baseTokens = []
  const tokenAccounts = {}
 
  const maxBatch = 1000
  for (const publicKey of publicKeys) {
    let page = 1
    let continueFetching = true
    while (continueFetching) {
      const res = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`, {
          "jsonrpc": "2.0",
          "id": `collector-tokens-${publicKey}-${page}`,
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

  const creatorFilteredTokens = !justCreator
  ? baseTokens
  : baseTokens.filter((token) => { 
    const creatorsAddresses = token.creators.map((creator) => creator.address)
    return Boolean(creatorsAddresses.find(address => publicKeys.includes(address)))
  })

  const mungedTokens = creatorFilteredTokens.map((token) => { 
    const { content, creators, ownership, id } = token

    return {
      creator: creators[0]?.address,
      description: content.metadata.description,
      animation_url: content.links.animation_url,
      image: content.links.image,
      mint: id,
      name: content.metadata.name,
      owner: ownership.owner,
      files: content.files,
      creators: creators,
      symbol: content.metadata.symbol,
      uri: content.json_uri,
      attributes: content.metadata.attributes,
      royalties: token.royalty,
      primary_sale_happened: token.royalty?.primary_sale_happened,
      //TODO Get from Helius when available and remove useTokenMetadata
      // is_edition: 
      // parent:
      // is_master_edition:
      // supply:
      // max_supply:
    }
  }).filter((item) => {
    const notUsable = !item.uri || !item.creator || !item.mint || !item.image
    return !notUsable
  });

  const visResults = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
    // mints: mungedTokens.map(token => token.mint),
    cld_ids: mungedTokens.map(token => getTokenCldImageId(token)),
  }).then(res => res.data)

  const { visibilities, optimizations, user_default } = visResults

  const results = []  

  for (const token of mungedTokens) {
    let result = { ...token }
    const cld_id = getTokenCldImageId(token)
    const visibility = visibilities[token.mint]
    const optimization = optimizations[cld_id]

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
      result.optimization_error = optimization.error_message;
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
  
    // const metaplex = Metaplex.make(connection);
    for (const result of results) { 
      
      //get onchain Metadata //TODO get this info from Helius once available
      if (useTokenMetadata) {
        //this works but takes a long time
        // const metadata = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(result.mint) });
        // result.is_master_edition = metadata.edition.maxSupply && Number(metadata.edition.maxSupply?.toString()) > 0
        // result.is_edition = !metadata.edition.isOriginal
        // result.address = metadata.metadataAddress.toString()
        try {
          //TODO check if this is actually needed
          // Add metadata PDA address
          // const metadataPDA = await Metadata.getPDA(new PublicKey(result.mint));
          // result.address = metadataPDA.toBase58(); 

          const edition = await Metadata.getEdition(connection, result.mint)
          const { data } = edition
          
          result.is_master_edition = data.maxSupply && Number(data.maxSupply?.toString()) > 0
          result.supply = data.supply ? Number(data.supply.toString()) : undefined
          result.max_supply = data.maxSupply ? Number(data.maxSupply.toString()) : undefined
          
          result.is_edition = Boolean(data.parent)
          result.parent = data.parent?.toString()
          result.edition_number = data.edition?.toString()
        } catch (err) {
          console.log("Error getting metadata for mint", result.mint)
        }
      }  
      
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

  DEBUG && console.timeEnd("getTokens Time")
  return results;
}

export default getTokens;

const fetcher = async ({ publicKeys, options }) => {
  if(!publicKeys) return undefined
  return await getTokens(publicKeys, options)
}
export function useTokens(publicKeys, options) {
  const { data: tokens, error } = useSWR({ publicKeys, options }, fetcher)
  return tokens
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
//   is_edition: boolean
//   optimized: boolean
//   optimization_error: string
//   primary_sale_happened
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


//ONCHAIN getMetadata
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

// function data(pubKey) {
//   let data = {
//     jsonrpc: "2.0",
//     id: 1,
//     method: "getTokenAccountsByOwner",
//     params: [
//       pubKey,
//       {
//         programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
//       },
//       {
//         encoding: "jsonParsed",
//       },
//     ],
//   };
//   return data;
// }