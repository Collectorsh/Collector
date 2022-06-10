import { getHandleAndRegistryKey } from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import { rpcHost } from "/config/settings";
import { Connection } from "@metaplex/js";

async function twitterNames(collectors) {
  const connection = new Connection(rpcHost);
  for (const collector of collectors) {
    try {
      const pubkey = new PublicKey(collector.highest_bidder);
      const [handle, registryKey] = await getHandleAndRegistryKey(
        connection,
        pubkey
      );
      collector.twitter = handle;
    } catch (err) {
      console.log(err);
    }
  }
  return collectors;
}

export default twitterNames;
