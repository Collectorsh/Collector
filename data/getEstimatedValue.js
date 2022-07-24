import apiClient from "/data/client/apiClient";
import { rpcHost } from "/config/settings";
import { Connection } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

async function getEstimatedValue(token) {
  const connection = new Connection(rpcHost);
  try {
    var tokenEditiondata = await Metadata.getEdition(
      connection,
      new PublicKey(token.mint)
    );
  } catch (err) {
    console.log(err);
  }

  var editionKey = tokenEditiondata ? tokenEditiondata.data.key : null;

  const res = await apiClient.post(
    "/estimate/price",
    {
      mint: token.mint,
      creator: token.creator,
      artist_name: token.artist_name,
      edition: editionKey,
    },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );

  if (res.data.status === "success") token.estimate = res.data.estimate;

  return token;
}

export default getEstimatedValue;
