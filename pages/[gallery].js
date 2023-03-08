import React, { useEffect, useContext, useCallback } from "react";
import Head from "next/head";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getMetadata from "/data/nft/getMetadata";
import GalleryContainer from "/components/gallery/GalleryContainer";
import GalleryNavigation from "/components/gallery/navigation/GalleryNavigation";
import MainNavigation from "/components/navigation/MainNavigation";
import ListingsContext from "/contexts/listings";
import { cdnImage } from "/utils/cdnImage";
import { pluralize } from "/utils/pluralize";
import { auctionHousesArray } from "/config/settings";
import { Connection } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

function Gallery({ user, tokens }) {
  const [listings, setListings] = useContext(ListingsContext);
  const auctionHouses = auctionHousesArray.map((a) => a.address);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection);

  const fetchListings = useCallback(async () => {
    const newListings = [];
    for (const auctionHouse of auctionHouses) {
      const lstngs = await metaplex.auctionHouse().findListings({
        auctionHouse: { address: auctionHouse, isNative: true },
      });
      for (const list of lstngs) {
        newListings.push({
          address: list.metadataAddress.toBase58(),
          price: list.price.basisPoints.toNumber(),
          seller: list.sellerAddress.toBase58(),
          auctionHouse: list.auctionHouse,
          tradeState: list.tradeStateAddress._bn,
          tradeStateBump: list.tradeStateAddress.bump,
        });
      }
    }
    setListings(newListings);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="dark:bg-black">
      <Head>
        {user && tokens.length > 0 && (
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
            <meta name="twitter:image" content={cdnImage(tokens[0].mint)} />
          </>
        )}
      </Head>
      {user ? <GalleryNavigation user={user} /> : <MainNavigation />}
      <div className="mx-auto px-4 clear-both">
        <div className="mx-auto pt-3">
          {tokens && user && <GalleryContainer tokens={tokens} user={user} />}
          {!user && (
            <div className="max-w-7xl mx-auto">
              <p className="dark:text-gray-100">
                We couldn&apos;t find a user with that name
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
    if (res.status === "success") user = res.user;
    let tokens = {};
    try {
      tokens = await getMetadata(user.public_keys);
    } catch (err) {
      console.log(err);
    }
    return { props: { user, tokens } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Gallery;
