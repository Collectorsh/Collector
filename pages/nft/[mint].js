import React, { useEffect, useContext, useCallback, useState } from "react";
import Head from "next/head";
import MainNavigation from "/components/navigation/MainNavigation";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Single from "/components/single/Single";
import { cdnImage } from "/utils/cdnImage";
import SingleNftContext from "/contexts/single_nft";
import { auctionHousesArray } from "/config/settings";
import { PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import findMarket from "/data/drops/findMarket";
import { connection } from "/config/settings";

function Nft({ image, token }) {
  const [, setSingleNft] = useContext(SingleNftContext);
  const auctionHouses = auctionHousesArray.map((a) => a.address);
  const [offers, setOffers] = useState([]);
  const [listings, setListings] = useState([]);
  const [market, setMarket] = useState();
  const metaplex = new Metaplex(connection);

  /////////////////////////////////////////////////////////////////////////////////////

  // Fetch Offers and Listings

  const fetchNft = useCallback(async (token) => {
    const mintPubKey = new PublicKey(token.mint);
    for (const auctionHouse of auctionHouses) {
      const bids = await metaplex.auctionHouse().findBids({
        auctionHouse: { address: auctionHouse, isNative: true },
        mint: mintPubKey,
      });
      for (const bid of bids) {
        if (bid.canceledAt || bid.purchaseReceiptAddress) continue;
        setOffers([
          ...offers,
          {
            price: bid.price.basisPoints.toNumber(),
            buyer: bid.buyerAddress.toBase58(),
            auctionHouse: bid.auctionHouse,
            tradeState: bid.tradeStateAddress._bn,
            tradeStateBump: bid.tradeStateAddress.bump,
          },
        ]);
      }

      const lstngs = await metaplex.auctionHouse().findListings({
        auctionHouse: { address: auctionHouse, isNative: true },
        mint: mintPubKey,
      });
      for (const list of lstngs) {
        if (list.canceledAt || list.purchaseReceiptAddress) continue;
        setListings([
          ...listings,
          {
            price: list.price.basisPoints.toNumber(),
            seller: list.sellerAddress.toBase58(),
            auctionHouse: list.auctionHouse,
            tradeState: list.tradeStateAddress._bn,
            tradeStateBump: list.tradeStateAddress.bump,
          },
        ]);
      }
    }
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchNft(token);
  }, [token, fetchNft]);

  useEffect(() => {
    setSingleNft({
      creators: token.creators,
      offers: offers,
      listings: listings,
    });
  }, [offers, listings, token]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Refetch function to update NFT and Activities
  const refetch = async (token) => {
    await sleep(10000);
    fetchNft(token);
  };

  /////////////////////////////////////////////////////////////////////////////////////

  // Find if mint belongs to a drop and has a marketplace
  const fetchMarketplace = useCallback(async () => {
    const res = await findMarket(token.mint);
    if (res.status === "success") setMarket(res.market);
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchMarketplace();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="dark:bg-black">
      <Head>
        {token && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={token.name} />
            <meta
              name="twitter:description"
              content={`View ${token.name} on Collector`}
            />
            <meta name="twitter:image" content={image} />
          </>
        )}
      </Head>

      <MainNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <Single token={token} market={market} refetch={refetch} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let mint = context.params.mint;
  let image = cdnImage(mint);
  let token = await getMetadataFromMint(mint);
  return { props: { image, token } };
}

export default Nft;
