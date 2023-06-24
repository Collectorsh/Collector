import React, { useEffect, useContext, useCallback, useState } from "react";
import Head from "next/head";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getMetadata from "/data/nft/getMetadata";
import GalleryContainer from "/components/gallery/GalleryContainer";
import GalleryNavigation from "/components/gallery/navigation/GalleryNavigation";
import MainNavigation from "/components/navigation/MainNavigation";
import ListingsContext from "/contexts/listings";
import OffersContext from "/contexts/offers";
import { cdnImage } from "/utils/cdnImage";
import { pluralize } from "/utils/pluralize";
import { auctionHousesArray } from "/config/settings";
import { Metaplex } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { useRouter } from "next/router";
import { useMetadata } from "../data/nft/getMetadata";


function Gallery({user}) {
  // const [tokens, setTokens] = useState([]);
  const tokens = useMetadata(user?.public_keys);

  const [, setListings] = useContext(ListingsContext);
  const [, setOffers] = useContext(OffersContext);
  const auctionHouses = auctionHousesArray.map((a) => a.address);
  const metaplex = new Metaplex(connection);

  const fetchListings = useCallback(async () => {
    const newListings = [];
    const newOffers = [];

    for (const auctionHouse of auctionHouses) {
      const lstngs = await metaplex.auctionHouse().findListings({
        auctionHouse: { address: auctionHouse, isNative: true },
      });
      for (const list of lstngs.filter(
        (l) => l.canceledAt === null && l.purchaseReceiptAddress === null
      )) {
        newListings.push({
          address: list.metadataAddress.toBase58(),
          price: list.price.basisPoints.toNumber(),
          seller: list.sellerAddress.toBase58(),
          auctionHouse: list.auctionHouse,
          tradeState: list.tradeStateAddress._bn,
          tradeStateBump: list.tradeStateAddress.bump,
        });
      }
      const bids = await metaplex.auctionHouse().findBids({
        auctionHouse: { address: auctionHouse, isNative: true },
      });
      for (const bid of bids.filter((b) => b.canceledAt === null)) {
        if (bid.canceledAt) continue;
        newOffers.push({
          address: bid.metadataAddress.toBase58(),
          price: bid.price.basisPoints.toNumber(),
          buyer: bid.buyerAddress.toBase58(),
          auctionHouse: bid.auctionHouse,
          tradeState: bid.tradeStateAddress._bn,
          tradeStateBump: bid.tradeStateAddress.bump,
        });
      }
    }
    setListings(newListings);
    setOffers(newOffers);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  // useEffect(() => {
  //   (async function fetchUser() {
  //     console.log("fetching user")
  //     if(!user) return;
  //     try {
  //       const tokens = await getMetadata(user.public_keys);
  //       if(tokens) setTokens(tokens);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })()
  // }, [user])

  return (
    <div className="dark:bg-black">
      <Head>
        {user > 0 && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content={`${pluralize(user.username)} gallery on Collector`}
            />
            <meta
              name="twitter:description"
              content="Show off your Solana NFT's with Collector"
            />
            <meta name="twitter:image" content={tokens.length ? cdnImage(tokens[0].mint) : user.profile_image} />
          </>
        )}
      </Head>
      {user ? <GalleryNavigation user={user} /> : <MainNavigation />}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3">
          {(user) && <GalleryContainer tokens={tokens} user={user} />}
          {(!user) && (
            <div className="max-w-7xl mx-auto">
              <p className="dark:text-gray-100 pt-8">
                We couldn&apos;t find a user with that name!!!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let username = context.params.gallery;
    let res = await getUserFromUsername(username);
    let user = null;
    if (res.status === "success") {
      user = res.user;
      return { props: { user} };
    } else {
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Gallery;
