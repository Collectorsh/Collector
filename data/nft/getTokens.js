import axios from "axios";
import apiClient from "/data/client/apiClient";
import { Metadata, Edition, MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import useSWR from 'swr'
import { connection } from "../../config/settings";
import { Metaplex } from "@metaplex-foundation/js";
import { getTokenCldImageId } from "../../utils/cloudinary/idParsing";
import getMintedIndexerByOwner from "../minted_indexer/getByOwner";
import { useEffect, useMemo, useState } from "react";
import { set } from "nprogress";
import { of } from "ramda";

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
  const queryByCreator = options.queryByCreator ?? false

 

  const baseTokens = []
  const mintedIndexerTokens = []
 
  const maxBatch = 1000
  for (const publicKey of publicKeys) {
    let page = 1 // Starts at 1
    let continueFetching = true;

    const fetchParams = queryByCreator
      ? {
        jsonrpc: '2.0',
        id: `creator-tokens-${ publicKey }-${ page }`,
        method: 'getAssetsByCreator',
        params: {
          creatorAddress: publicKey,
          onlyVerified: true,
          page: page, 
          limit: maxBatch
        },
      }
      : {
        jsonrpc: "2.0",
        id: `collector-tokens-${ publicKey }-${ page }`,
        method: "getAssetsByOwner",
        params: {
          ownerAddress: publicKey,
          page: page,
          limit: maxBatch,
          // "displayOptions": {
          //   "showUnverifiedCollections": true,
          //   "showCollectionMetadata": true
          // },
        }
      }
    
    while (continueFetching) {
      const res = await axios.post(
          `https://mainnet.helius-rpc.com/?api-key=${ process.env.NEXT_PUBLIC_HELIUS_API_KEY }`,
          fetchParams
        ).then((res) => {
          return res.data.result;
        }).catch((err) => {
          console.log("Error Fetching Metadata By Owner:", err);
          continueFetching = false
        });

      if (res?.total <= maxBatch) {
        continueFetching = false
      } else {
        page++
      }

      baseTokens.push(...res.items)
    }
    //get items from minted_indexer in case helius is missing some
    const indexerRes = await getMintedIndexerByOwner(publicKey)
    if (indexerRes?.mints?.length) {
      mintedIndexerTokens.push(...indexerRes.mints)
    }
  }

  const creatorFilteredTokens = !justCreator
    ? baseTokens
    : baseTokens.filter((token) => { 
      
    const creatorsAddresses = token.creators.map((creator) => creator.address)
    return Boolean(creatorsAddresses.find(address => publicKeys.includes(address)))
  })

  const mungedTokens = creatorFilteredTokens.map((token) => { 
    const { content, creators, ownership, id } = token
    const files = content?.files?.map((file) => ({
      ...file,
      type: file.mime
    }))
  
    const image_cdn = content?.files?.find((file) => file.cdn_uri)?.cdn_uri
    return {
      artist_address: creators[0]?.address,
      owner_address: ownership.owner,
      description: content.metadata.description,
      animation_url: content.links.animation_url,
      image: content.links.image,
      mint: id,
      name: content.metadata.name,
      files: files,
      creators: creators,
      symbol: content.metadata.symbol,
      uri: content.json_uri,
      attributes: content.metadata.attributes,
      royalties: token.royalty.basis_points,
      primary_sale_happened: token.royalty?.primary_sale_happened,
      image_cdn
      //TODO Get from Helius when available and remove useTokenMetadata
      // is_edition: 
      // parent:
      // is_master_edition:
      // supply:
      // max_supply:
    }
  }).filter((item) => {
    const notUsable = !item.uri || !item.artist_address || !item.mint || !item.image
    return !notUsable
  });

  //Insert items from minted_indexer if missing from helius 
  //or if helius doesnt include off chain metadata (image, etc) in which case we've filtered them out above
  for (const mintedIndexerToken of mintedIndexerTokens) {
    const alreadyExists = mungedTokens.some((token) => token.mint === mintedIndexerToken.mint)
    if (!alreadyExists) {
      // if filtering by creator, skip indexed tokens that arent by the creator 
      if (justCreator && !publicKeys.includes(mintedIndexerToken.artist_address)) continue; 

      mungedTokens.unshift(mintedIndexerToken) //insert to beginning of array so it shows up first
    }
  }

  const visResults = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
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
    // if (useTokenMetadata) { 
    //   try {
    //     const metadata = await metaplex.nfts().findByMint({
    //       mintAddress: new PublicKey(result.mint)
    //     })
    //     const edition = metadata.edition

    //     result.collectionDetails = metadata.collectionDetails;

    //     result.is_master_edition = Boolean(edition.maxSupply && Number(edition.maxSupply?.toString()) > 0)
    //     result.supply = edition.supply ? Number(edition.supply.toString()) : undefined
    //     result.max_supply = edition.maxSupply ? Number(edition.maxSupply.toString()) : undefined
        
    //     result.is_edition = !edition.isOriginal
    //     result.parent = edition.parent?.toString()
    //     result.edition_number = edition.number?.toString()

    //   } catch (err) {
    //     console.log("Error getting metadata for mint", result.mint)
    //   }
    // }
      
    // Loop through results and set artist name, twitter
    let tokens = creatorResp.data.filter((t) => t.public_key === result.artist_address);
    if (tokens.length > 0) {
      let token = tokens[tokens.length - 1];
      result.artist_name = token.name;
      result.artist_twitter = token.twitter;
      if (result.artist_twitter === null) {
        let toke = creatorResp.data.find(
          (t) => t.public_key === result.artist_address && t.twitter !== null
        );
        if (toke) result.artist_twitter = toke.twitter;
      }
    }
  }

  // if (useTokenMetadata) {
  //   results = results.filter((item) => {
  //     return !item.collectionDetails
  //   })
  // }

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
  const { data, error, mutate} = useSWR({ publicKeys, options }, fetcher)

  const [tokens, setTokens] = useState(undefined)

  //TODO need to figure out how to memoize completed results and not refetch when SWR is called again

  useEffect(() => {
    if (!data) setTokens(undefined)
    if (data) {
      if (!options?.useTokenMetadata) {
        setTokens(data)
      } else {
        const nameSorted = data.sort((a, b) => a.name.localeCompare(b.name))
        setTokens(undefined)

        const metaplex = Metaplex.make(connection);
        //if using token metadata, set the tokens as they are fetched
        (async () => {
          for (const t of nameSorted) {
            const metadata = await getMetadata(metaplex, t.mint)
      
            //dont add collection nfts
            if (!metadata.collectionDetails) {
              setTokens((prevTokens) => {

                //match metadata to data to prevent mix ups in the async process
                const token = nameSorted.find((t) => t.mint === metadata.mint)
        
                let newTokens = prevTokens?.length ? prevTokens : []
                newTokens = [...newTokens, { ...token, ...metadata }]
               
                const sorted = newTokens.sort((a, b) => a.name.localeCompare(b.name))
                return sorted;
              })
            }
          }
        })();
      }
    }
  }, [data, options?.useTokenMetadata])

  return tokens
}

const getMetadata = async (metaplex, mint) => { 
  const result = { mint }
  try {
    const metadata = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(mint)
    })

    const edition = metadata.edition

    result.collectionDetails = metadata.collectionDetails;

    result.is_master_edition = Boolean(edition.maxSupply && Number(edition.maxSupply?.toString()) > 0)
    result.supply = edition.supply ? Number(edition.supply.toString()) : undefined
    result.max_supply = edition.maxSupply ? Number(edition.maxSupply.toString()) : undefined

    result.is_edition = !edition.isOriginal
    result.parent = edition.parent?.toString()
    result.edition_number = edition.number?.toString()

    result.is_one_of_one = !result.is_edition && !result.is_master_edition;

  } catch (err) {
    console.log("Error getting metadata for mint", mint)
  }
  return result
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