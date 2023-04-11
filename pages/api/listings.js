import { auctionHousesArray } from "/config/settings";
import { Connection } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

export default async function handler(req, res) {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
    const metaplex = new Metaplex(connection);
    const listings = [];
    const auctionHouses = auctionHousesArray.map((a) => a.address);
    for (const auctionHouse of auctionHouses) {
      const lstngs = await metaplex.auctionHouse().findListings({
        auctionHouse: { address: auctionHouse, isNative: true },
      });
      for (const list of lstngs.filter(
        (l) => l.canceledAt === null && l.purchaseReceiptAddress === null
      )) {
        console.log(list);
        try {
          const nft = await metaplex.nfts().findByMetadata({
            metadata: list.metadataAddress,
          });
          listings.push({
            address: list.metadataAddress.toBase58(),
            mint: nft.mint.address.toBase58(),
            price: list.price.basisPoints.toNumber(),
            seller: list.sellerAddress.toBase58(),
            auctionHouse: list.auctionHouse,
            tradeState: list.tradeStateAddress._bn,
            tradeStateBump: list.tradeStateAddress.bump,
            created: list.createdAt.toNumber(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
    return res.status(200).json({ listings: listings });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
