import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import editions from "../../editions.json";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_GACHA_RPC);
let key = process.env.NEXT_PUBLIC_PRIVATE_KEY;
let wallet = Keypair.fromSecretKey(Buffer.from(key));
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));
metaplex.use(bundlrStorage());

export default async function handler(req, res) {
  try {
    for (const edition of editions) {
      const attributes = [
        { trait_type: "artist", value: edition.artist_name },
        {
          trait_type: "edition",
          value: `${edition.edition}/${edition.supply}`,
        },
      ];
      const mintAddress = new PublicKey(edition.mint);
      const nft = await metaplex.nfts().findByMint({ mintAddress });

      const { uri: newUri } = await metaplex.nfts().uploadMetadata({
        ...nft.json,
        attributes: attributes,
      });

      await metaplex.nfts().update({
        nftOrSft: nft,
        uri: newUri,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
