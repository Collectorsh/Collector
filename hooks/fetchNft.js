import { auctionHousesArray } from "/config/settings";
import { PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { connection } from "/config/settings";

const metaplex = new Metaplex(connection);
const auctionHouses = auctionHousesArray.map((a) => a.address);

export async function fetchNft(token) {
  const offers = [];
  const listings = [];
  const mintPubKey = new PublicKey(token.mint);
  for (const auctionHouse of auctionHouses) {
    const bids = await metaplex.auctionHouse().findBids({
      auctionHouse: { address: auctionHouse, isNative: true },
      mint: mintPubKey,
    });
    for (const bid of bids) {
      if (bid.canceledAt) continue;
      offers = [
        ...offers,
        {
          price: bid.price.basisPoints.toNumber(),
          buyer: bid.buyerAddress.toBase58(),
          auctionHouse: bid.auctionHouse,
          tradeState: bid.tradeStateAddress._bn,
          tradeStateBump: bid.tradeStateAddress.bump,
        },
      ];
    }

    const lstngs = await metaplex.auctionHouse().findListings({
      auctionHouse: { address: auctionHouse, isNative: true },
      mint: mintPubKey,
    });
    for (const list of lstngs) {
      if (list.canceledAt || list.purchaseReceiptAddress) continue;
      listings = [
        ...listings,
        {
          price: list.price.basisPoints.toNumber(),
          seller: list.sellerAddress.toBase58(),
          auctionHouse: list.auctionHouse,
          tradeState: list.tradeStateAddress._bn,
          tradeStateBump: list.tradeStateAddress.bump,
        },
      ];
    }
  }
  return {
    creators: token.creators,
    offers: offers,
    listings: listings,
  };
}
