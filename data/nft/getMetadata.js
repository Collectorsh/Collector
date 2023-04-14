import axios from "axios";
import apiClient from "/data/client/apiClient";
import { rpcHost } from "/config/settings";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { connection } from "/config/settings";

function coalesce(val, def) {
  if (val === null || typeof val === "undefined") return def;
  return val;
}

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
  // Filter out any that don't have data uri's on arweave or ipfs
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
    } else {
      result.order_id = null;
      result.visible = res.data.default;
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

export default getMetadata;

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
