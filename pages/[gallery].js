import React, { useEffect, useContext, useCallback } from "react";
import Head from "next/head";
import getUserFromUsername from "/data/user/getUserFromUsername";
import getMetadata from "/data/nft/getMetadata";
import GalleryContainer from "/components/gallery/GalleryContainer";
import GalleryNavigation from "/components/gallery/navigation/GalleryNavigation";
import MainNavigation from "/components/navigation/MainNavigation";
import ListingsContext from "/contexts/listings";
import { useLazyQuery } from "@apollo/client";
import { getListingsQuery } from "/queries/listings";
import { cdnImage } from "/utils/cdnImage";
import { pluralize } from "/utils/pluralize";

function Gallery({ user, tokens }) {
  const [listings, setListings] = useContext(ListingsContext);

  const [getListingsQl, { loading, error, data }] =
    useLazyQuery(getListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
        owners: user ? user.public_keys : [],
      },
    });
    setListings([...listings, ...res.data.nfts]);
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
        <div className="mx-auto px-2 pt-3 md:px-0">
          {tokens && <GalleryContainer tokens={tokens} user={user} />}
          {!user && (
            <p className="dark:text-gray-100">
              We couldn&apos;t find a user with that name
            </p>
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
    let user = res.user;
    let tokens = await getMetadata(user.public_keys);
    return { props: { user, tokens } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}

export default Gallery;
