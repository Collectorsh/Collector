import axios from "axios";
import apiClient from "/data/client/apiClient";
import { Metadata, Edition, MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import useSWR from 'swr'
import { connection } from "../../config/settings";
import { Metaplex } from "@metaplex-foundation/js";
import { getTokenCldImageId } from "../../utils/cloudinary/idParsing";
import getMintedIndexerByOwner from "../minted_indexer/getByOwner";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserTokensContext from "../../contexts/userTokens";
import getMintedIndexerByCreator from "../minted_indexer/getByCreator";
import UserContext from "../../contexts/user";
import { createIndex } from "../minted_indexer/create";

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
          limit: maxBatch,
          displayOptions: {
            "showUnverifiedCollections": true,
            "showCollectionMetadata": true,
          },
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
          displayOptions: {
            "showUnverifiedCollections": true,
            "showCollectionMetadata": true,
          },
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

    //get items from minted_indexer to suppliment edition data, or in case helius missed them entirely
    let indexerRes
    if (queryByCreator) {
      indexerRes = await getMintedIndexerByCreator(publicKey)
    } else {
      indexerRes = await getMintedIndexerByOwner(publicKey)
    }
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
    const { content, creators, ownership, id, grouping, compression } = token
    const files = content?.files?.map((file) => ({
      ...file,
      type: file.mime
    }))

    const collectionInfo = (grouping.length && grouping[0].collection_metadata) ? {
      ...grouping[0].collection_metadata,
      verified: grouping[0].verified,
    } : undefined

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
      image_cdn,
      collection: collectionInfo,
      compressed: compression.compressed,
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
    const tokenExists = mungedTokens.some((token) => token.mint === mintedIndexerToken.mint)
    if (!tokenExists){
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

    const metadata = mintedIndexerTokens.find((t) => t.mint === token.mint)

    if (metadata) { 
      result = { ...metadata, ...result}
    }

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
  
  for (const result of results) {       
    // Loop through results and set artist name, twitter
    // let artists = creatorResp.data.filter((t) => t.public_key === result.artist_address);
    const creatorsAddresses = result.creators.map((creator) => creator.address)
    let artists = creatorResp.data.filter((t) => creatorsAddresses.includes(t.public_key) );
    if (artists.length > 0) {
      let artist = artists[artists.length - 1];
      result.artist_name = artist.name;
      result.artist_twitter = artist.twitter;
      if (result.artist_twitter === null) {
        let toke = creatorResp.data.find(
          (t) => t.public_key === result.artist_address && t.twitter !== null
        );
        if (toke) result.artist_twitter = toke.twitter;
      }
    }
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
  const { data, error } = useSWR({ publicKeys, options }, fetcher)
  const [user] = useContext(UserContext);

  const { allTokens, setAllTokens } = useContext(UserTokensContext)
  const [fetched, setFetched] = useState(0)
  const metadataRef = useRef([]);
  const indexedRef = useRef([]);

  const loading = !data && !error || fetched > 0

  const useTokenMetadata = useMemo(() => options?.useTokenMetadata ?? false, [options])

  const tokenKey = useMemo(() => {
    const keys = publicKeys?.join("-")
    const optionKey = Object.entries(options ?? {}).reduce((acc, curr) => { 
      const [key, value] = curr
      if(value) acc += key + "-"
      return acc
    }, "")
    return `${keys}_${optionKey}`
  }, [publicKeys, options])

  const alreadySet = useMemo(() => Object.keys(allTokens ?? {}).includes(tokenKey), [allTokens, tokenKey])


  const tokens = useMemo(() => allTokens?.[tokenKey], [allTokens, tokenKey])
  
  useEffect(() => {    
    if (data && !alreadySet) {
      if (!useTokenMetadata) {
        setAllTokens((prevTokens) => {
          const newTokens = { ...prevTokens, [tokenKey]: data }
          return newTokens
        })
      } else {
        //if using token metadata, set the tokens as they are fetched
        const metaplex = Metaplex.make(connection);

        metadataRef.current = []
        const nameSorted = data.sort((a, b) => a.name.localeCompare(b.name));
        
        (async () => {
          let fetchedLocal = 0;

          const withMetadata = [];
          const remaining = [];
          nameSorted.forEach((token) => {
            //using .id for now because it means we've recorded the edition metadata,
            //but once we have that + the collection metadata, we can use something else (or not need this useEffect at all maybe?)
            if(token?.id !== undefined) {
              withMetadata.push(token)
            } else {
              remaining.push(token)
            }
          })

          // update ref with metadata tokens (but not collection nfts)
          metadataRef.current = withMetadata.filter((item) => { 
            return !item.is_collection_nft
          })
          fetchedLocal += withMetadata.length
          setFetched(fetchedLocal) //update state
          
          //fetch metadata from tokens missing edition info
          for (const t of remaining) {
        
            let fullToken = { ...t }
            //compressed nfts dont have the same metadata structure
            if (!t.compressed) {
              const metadata = await getMetadata(metaplex, t.mint)
              const token = remaining.find((t) => t.mint === metadata.mint) //finding token again incase of race condition
              fullToken = { ...token, ...metadata }
            } 
            //update indexer with full token
            try {
              const artistId = user?.public_keys.includes(fullToken.artist_address) ? user.id : null;
              const ownerId = user?.public_keys.includes(fullToken.owner_address) ? user.id : null;

              if (!indexedRef.current.includes(fullToken.mint)) {
                indexedRef.current.push(fullToken.mint)

                await createIndex({
                  apiKey: user?.api_key,
                  artistId,
                  ownerId,
                  token: fullToken
                })
              }
              
            } catch (err) { 
              console.log(`Error creating minted_indexer record mint: ${ fullToken.mint }`, err)
              continue;
            }
        
        
            // //dont add collection nfts to metadataRef
            if (!fullToken.is_collection_nft) {
              const newTokens = [...metadataRef.current, fullToken]
              metadataRef.current = newTokens.sort((a, b) => a.name.localeCompare(b.name))
            }

            fetchedLocal++;
            setFetched(fetchedLocal)
          }

          //update state once done
          setAllTokens((prevTokens) => {
            const newTokens = { ...prevTokens, [tokenKey]: metadataRef.current }
            return newTokens
          })

          setFetched(fetchedLocal) //update state at the end again just in case
          setTimeout(() => setFetched(0), 100) //reset state after 0.1 second (for future fetches)
        })();
      }
    }

  }, [data, tokenKey, useTokenMetadata, alreadySet, setAllTokens, user])

  return {
    tokens,
    loading,
    total: data?.length ?? 0,
    current: fetched,
  }
}

const getMetadata = async (metaplex, mint) => { 
  const result = { mint }
  try {
    const metadata = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(mint)
    })

    const edition = metadata.edition

    result.is_collection_nft = Boolean(metadata.collectionDetails);

    result.is_master_edition = Boolean(edition.maxSupply && Number(edition.maxSupply?.toString()) > 0)
    result.supply = edition.supply ? Number(edition.supply.toString()) : undefined
    result.max_supply = edition.maxSupply ? Number(edition.maxSupply.toString()) : undefined

    result.is_edition = !edition.isOriginal

    result.parent = edition.parent?.toString()
    result.address = edition.address?.toString()


    result.edition_number = edition.number?.toString()

    //TODO "parent" isnt the mint address, need to figure out how to get it
    // //add total supply to editions
    // if (result.parent && !result.max_supply) {
    //   const accountInfo = await connection.getAccountInfo(new PublicKey(result.parent))

    //   // const parentMetadata = await metaplex.nfts().findByMint({
    //   //   mintAddress: new PublicKey(result.parent)
    //   // })
    //   // result.max_supply = parentMetadata.edition?.maxSupply ? Number(parentMetadata.edition.maxSupply.toString()) : undefined
    // }

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