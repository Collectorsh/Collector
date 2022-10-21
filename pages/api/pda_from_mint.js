import { MetadataProgram } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";

export default async function handler(req, res) {
  try {
    const mint = new PublicKey(req.body.mint);
    const [metadata] = await MetadataProgram.findMetadataAccount(mint);
    return res.status(200).json({ pda: metadata });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
