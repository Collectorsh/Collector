import axios from "axios";
import apiClient from "/data/client/apiClient";
import { rpcHost } from "/config/settings";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { connection } from "/config/settings";
import hellomoonClient from "../client/helloMoonClient";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

function coalesce(val, def) {
  if (val === null || typeof val === "undefined") return def;
  return val;
}

//OLD
async function getMetadata(publicKeys) {
  var results = [];
  var tokenAccounts = [];
  for (const publicKey of publicKeys) {
    const tokenMetadata = await Metadata.findDataByOwner(
      connection,
      new PublicKey(publicKey)
    );
    for (const meta of tokenMetadata) {
      results.push({
        mint: meta.mint,
        name: meta.data.name,
        uri: meta.data.uri,
        owner: publicKey,
        creator: meta.data.creators ? meta.data.creators[0].address : undefined,
      });
    }
    // Get the tokenAccountsByOwner
    let res = await axios.post(rpcHost, data(publicKey));
    for (const account of res.data.result.value) {
      let associatedTokenAccountAddress = account.pubkey;
      let mint = account.account.data.parsed.info.mint;
      tokenAccounts.push({
        mint: mint,
        associatedTokenAccountAddress: associatedTokenAccountAddress,
      });
    }
  }


  // Filter out any that don't have data uri's 
  results = results.filter(
    (item) => item.uri !== "" && item.creator !== undefined
  );

  // Retrieve order and visibility from the server
  const res = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
  });

  // Loop through results and set visibility and order
  for (const result of results) {
    let token = res.data.mints.find((m) => m.mint_address === result.mint);

    if (token) {
      result.order_id = token.order_id;
      result.visible = token.visible;
      result.accept_offers = token.accept_offers;
      result.estimate = token.estimate;
      result.span = token.span;
    } else {
      result.order_id = null;
      result.visible = res.data.default;
      result.span = 1;
    }

    // Also find the associatedTokenAccountAddress
    let ta = tokenAccounts.find((a) => a.mint === result.mint);
    result.associatedTokenAccountAddress = ta.associatedTokenAccountAddress;
    // Add metadata address
    const metadataPDA = await Metadata.getPDA(new PublicKey(result.mint));
    result.address = metadataPDA.toBase58();
  }

  // Get creator details
  const resp = await apiClient.post("/creator/details", {
    tokens: results,
  });

  // Loop through results and set artist name, twitter
  for (const result of results) {
    let tokens = resp.data.filter((t) => t.public_key === result.creator);
    if (tokens.length > 0) {
      let token = tokens[tokens.length - 1];
      result.artist_name = token.name;
      result.artist_twitter = token.twitter;
      if (result.artist_twitter === null) {
        let toke = resp.data.find(
          (t) => t.public_key === result.creator && t.twitter !== null
        );
        if (toke) result.artist_twitter = toke.twitter;
      }
    }
  }
  results = results.sort((a, b) =>
    coalesce(a.order_id, +Infinity) > coalesce(b.order_id, +Infinity)
      ? 1
      : coalesce(b.order_id, +Infinity) > coalesce(a.order_id, +Infinity)
      ? -1
      : 0
  );
  return results;
}

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

//NEW Helius
async function getMetadataHELIUS(publicKeys) {
  const baseTokens = []

  for (const publicKey of publicKeys) {
    let paginationToken = undefined
    let requestCount = 0
    while (requestCount === 0 || paginationToken) {
      const res = await axios.post(`https://rpc.helius.xyz/?api-key=e00e277a-978f-4dda-b516-a017c5588f6b`, {
        "jsonrpc": "2.0",
        "id": publicKey,
        "method": "getAssetsByOwner",
        "params": {
          "ownerAddress": publicKey,
          "page": 1,
          "limit": 1000,
          // "sortBy": {
            //   "sortBy": "created",
            //   "sortDirection": "asc"
            // },
            // "before": "string",
            // "after": "string"
          }
        })
        console.log("🚀 ~ file: getMetadata.js:139 ~ HELIUS:", res)

      if (res?.paginationToken) {
        paginationToken = res.paginationToken
      } else {
        paginationToken = undefined
      }

      if (res?.data) {
        baseTokens.push(...res.data)
      }
      requestCount++;
    }
  }

  const visAndOrders = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
  });

  const creatorDetails = await apiClient.post("/creator/details", {
    tokens: baseTokens,
  });

  for (const token of baseTokens) {

    const visibilityAndOrder = visAndOrders.data.mints.find((m) => m.mint_address === token.nftMint)
    const filteredCreatorDetails = creatorDetails.data.filter((t) => t.public_key === token.creator);

    token.owner = token.ownerAccount
    token.address = token.metadataAddress
    token.mint = token.nftMint
    token.name = token.metadataJson.name
    token.uri = token.metadataJson.uri
    token.symbol = token.metadataJson.symbol

    if (visibilityAndOrder) {
      token.order_id = visibilityAndOrder.order_id;
      token.visible = visibilityAndOrder.visible;
      token.accept_offers = visibilityAndOrder.accept_offers;
      token.estimate = visibilityAndOrder.estimate;
      token.span = visibilityAndOrder.span;
    } else {
      token.order_id = null;
      token.visible = visAndOrders.data.default;
      token.span = 1;
    }

    if (filteredCreatorDetails.length > 0) {
      const filteredCreatorDetail = filteredCreatorDetails[filteredCreatorDetails.length - 1];
      token.artist_name = filteredCreatorDetail.name;
      token.artist_twitter = filteredCreatorDetail.twitter;
      if (token.artist_twitter === null) {
        const filteredCreatorDetail = creatorDetails.data.find(
          (t) => t.public_key === token.creator && t.twitter !== null
        );
        if (filteredCreatorDetail) token.artist_twitter = filteredCreatorDetail.twitter;
      }
    }

  }
  // TODO find associatedTokenAccountAddress with hello moon here or find it at time of use

  console.log("🚀 ~ file: getMetadata.js:215 ~ getMetadata ~ baseTokens:", baseTokens.length)
  return baseTokens.sort((a, b) =>
    coalesce(a.order_id, +Infinity) > coalesce(b.order_id, +Infinity)
      ? 1
      : coalesce(b.order_id, +Infinity) > coalesce(a.order_id, +Infinity)
        ? -1
        : 0
  );
}

//NEW Hellomoon
async function getMetadataHELLO(publicKeys) { 
  const baseTokens = []

  for (const publicKey of publicKeys) { 
    let paginationToken = undefined
    let requestCount = 0
    while (requestCount === 0 || paginationToken) {
      const res = await hellomoonClient
        .post("/v0/nft/mints-by-owner", {
          ownerAccount: publicKey,
          limit: 1000,
          paginationToken
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
        
      if (res?.paginationToken) {
        paginationToken = res.paginationToken
      } else {
        paginationToken = undefined
      }
        
      if (res?.data) {
        baseTokens.push(...res.data)
      }
      console.log("🚀 ~ file: getMetadata.js:253 ~ getMetadata ~ res:", res)
      requestCount++;
    }
  }

  const visAndOrders = await apiClient.post("/get_visibility_and_order", {
    public_key: publicKeys[0],
  });

  const creatorDetails = await apiClient.post("/creator/details", {
    tokens: baseTokens,
  });

  for(const token of baseTokens) {
    
    const visibilityAndOrder = visAndOrders.data.mints.find((m) => m.mint_address === token.nftMint)
    const filteredCreatorDetails = creatorDetails.data.filter((t) => t.public_key === token.creator);
    
    token.owner = token.ownerAccount
    token.address = token.metadataAddress
    token.mint = token.nftMint
    token.name = token.metadataJson.name
    token.uri = token.metadataJson.uri
    token.symbol = token.metadataJson.symbol

    if(visibilityAndOrder) {
      token.order_id = visibilityAndOrder.order_id;
      token.visible = visibilityAndOrder.visible;
      token.accept_offers = visibilityAndOrder.accept_offers;
      token.estimate = visibilityAndOrder.estimate;
      token.span = visibilityAndOrder.span;
    } else {
      token.order_id = null;
      token.visible = visAndOrders.data.default;
      token.span = 1;
    }

    if (filteredCreatorDetails.length > 0) {
      const filteredCreatorDetail = filteredCreatorDetails[filteredCreatorDetails.length - 1];
      token.artist_name = filteredCreatorDetail.name;
      token.artist_twitter = filteredCreatorDetail.twitter;
      if (token.artist_twitter === null) {
        const filteredCreatorDetail = creatorDetails.data.find(
          (t) => t.public_key === token.creator && t.twitter !== null
        );
        if (filteredCreatorDetail) token.artist_twitter = filteredCreatorDetail.twitter;
      }
    }

  }
  // TODO find associatedTokenAccountAddress with hello moon here or find it at time of use
    
  console.log("🚀 ~ file: getMetadata.js:215 ~ getMetadata ~ baseTokens:", baseTokens.length)
  return baseTokens.sort((a, b) =>
    coalesce(a.order_id, +Infinity) > coalesce(b.order_id, +Infinity)
      ? 1
      : coalesce(b.order_id, +Infinity) > coalesce(a.order_id, +Infinity)
        ? -1
        : 0
  );
}

export default getMetadata;



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