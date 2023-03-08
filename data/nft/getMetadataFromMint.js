import axios from "axios";
import { rpcHost } from "/config/settings";
import { Connection } from "@metaplex/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import apiClient from "/data/client/apiClient";

async function getMetadataFromMint(mint) {
  var single = {};

  // Find the owners associated token address
  let res = await axios.post(rpcHost, accountData(mint));
  if (!res.data.result.value[0]) return;

  single.associatedTokenAccountAddress = res.data.result.value[0].address;

  const connection = new Connection(rpcHost);

  // Get the owner
  const largestAccounts = await connection.getTokenLargestAccounts(
    new PublicKey(mint)
  );

  const largestAccountInfo = await connection.getParsedAccountInfo(
    largestAccounts.value[0].address
  );

  single.owner = largestAccountInfo.value.data.parsed.info.owner;

  const metadataPDA = await Metadata.getPDA(new PublicKey(mint));
  single.address = metadataPDA.toBase58();
  const tokenMetadata = await Metadata.load(connection, metadataPDA);
  single.creators = [];
  for (const c of tokenMetadata.data.data.creators) {
    single.creators.push({ address: c.address });
  }

  // Get verified collection data
  if (
    tokenMetadata.data.collection &&
    tokenMetadata.data.collection.verified === 1
  ) {
    const collectionPDA = await Metadata.getPDA(
      new PublicKey(tokenMetadata.data.collection.key)
    );
    const collectionMetadata = await Metadata.load(connection, collectionPDA);
    single.collection = {
      name: collectionMetadata.data.data.name,
      uri: collectionMetadata.data.data.uri,
      mint: tokenMetadata.data.collection.key,
    };
    const collectionuridata = await axios.get(single.collection.uri);
    single.collection.description = collectionuridata.data.description;
    single.collection.image = collectionuridata.data.image;
  }

  single.uri = tokenMetadata.data.data.uri || null;
  single.mint = tokenMetadata.data.mint || null;
  // single.name = tokenMetadata.data.data.name || null;
  single.sellerFeeBasisPoints =
    tokenMetadata.data.data.sellerFeeBasisPoints || null;

  const uridata = await axios.get(single.uri);

  if (uridata.data.attributes) single.attributes = uridata.data.attributes;
  single.image = uridata.data.image || null;
  single.description = uridata.data.description || null;
  single.properties = uridata.data.properties || null;
  single.symbol = uridata.data.symbol || null;
  single.name = uridata.data.name || null;
  single.animation_url = uridata.data.animation_url || null;

  if (single.properties && single.properties.creators) {
    // Get creator details
    const resp = await apiClient.post("/creator/details", {
      tokens: [{ creator: single.properties.creators[0].address }],
    });
    if (resp.data[0]) {
      single.artist_name = resp.data[0].name;
      single.artist_twitter = resp.data[0].twitter;
    }
  }

  try {
    var tokenEditiondata = await Metadata.getEdition(
      connection,
      new PublicKey(mint)
    );
  } catch (err) {
    console.log(err);
    return single;
  }

  single.edition = {};
  single.edition.key = tokenEditiondata.data.key;
  if ([2, 6].includes(single.edition.key)) {
    single.edition.name = "Master Edition";
    try {
      single.edition.max_supply = tokenEditiondata.data.maxSupply.toString();
      single.edition.supply = tokenEditiondata.data.supply.toString();
    } catch {
      single.edition.max_supply = "0";
      single.edition.supply = "0";
    }
  }
  if (single.edition.key === 1) {
    single.edition.name = "Limited Edition";
    single.edition.supply = tokenEditiondata.data.edition.toString();
    single.edition.parent = tokenEditiondata.data.parent;
    let res = await axios.post(rpcHost, data([single.edition.parent]));
    let ed = await apiClient.post("/editiondata", {
      data: res.data.result.value[0].data[0],
    });
    if (ed.data.supply) single.edition.max_supply = ed.data.supply;
  }

  return single;
}

export default getMetadataFromMint;

function data(pub_keys) {
  let data = {
    jsonrpc: "2.0",
    id: 1,
    method: "getMultipleAccounts",
    params: [
      pub_keys,
      {
        encoding: "jsonParsed",
      },
    ],
  };
  return data;
}

function accountData(mint) {
  let data = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenLargestAccounts",
    params: [mint],
  };
  return data;
}
