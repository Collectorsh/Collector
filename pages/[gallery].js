import React, { useEffect, useContext, useCallback, useState, useMemo } from "react";
import Head from "next/head";
import getUserFromUsername from "/data/user/getUserFromUsername";
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
import { useTokens } from "../data/nft/getTokens";
import { useImageFallbackContext } from "../contexts/imageFallback";
import { getTokenCldImageId } from "../utils/cloudinary/idParsing";


function Gallery({user}) {
  const { tokens } = useTokens(user?.public_keys, {
    justVisible: true,
    useArtistDetails: true
  });

  // const [, setListings] = useContext(ListingsContext);
  // const [, setOffers] = useContext(OffersContext);
  // const auctionHouses = auctionHousesArray.map((a) => a.address);
  // const metaplex = new Metaplex(connection);

  const { waiting, completed, uploadAll, cloudinaryCompleted, uploadAllCompleted } = useImageFallbackContext()
  const progress = ((completed) / waiting) * 100
  const showProgress = Boolean(waiting && waiting > completed)

  const visibleTokens = useMemo(() => tokens?.filter(token => token.visible), [tokens]);

  const renderedTokens = useMemo(() => {
    if(!visibleTokens) return []
    const optimized = visibleTokens?.filter(token => token.optimized === "True")
    const completed = visibleTokens?.filter(token => {
      const cld_id = getTokenCldImageId(token)
      return cloudinaryCompleted.some((cc) => cc.cld_id === cld_id)
    })
    return [...optimized, ...completed]
  },[visibleTokens, cloudinaryCompleted]);

  useEffect(() => {
    if (!waiting && visibleTokens?.length > 0) {
      uploadAll(visibleTokens)//will optimized any images not optimized yet
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTokens])

  // const fetchListings = useCallback(async () => {
  //   const newListings = [];
  //   const newOffers = [];

  //   try {
  //     for (const auctionHouse of auctionHouses) {
  //       const lstngs = await metaplex.auctionHouse()?.findListings({
  //         auctionHouse: { address: auctionHouse, isNative: true },
  //       });
  //       for (const list of lstngs.filter(
  //         (l) => l.canceledAt === null && l.purchaseReceiptAddress === null
  //       )) {
  //         newListings.push({
  //           address: list.metadataAddress.toBase58(),
  //           price: list.price.basisPoints.toNumber(),
  //           seller: list.sellerAddress.toBase58(),
  //           auctionHouse: list.auctionHouse,
  //           tradeState: list.tradeStateAddress._bn,
  //           tradeStateBump: list.tradeStateAddress.bump,
  //         });
  //       }
  //       const bids = await metaplex.auctionHouse().findBids({
  //         auctionHouse: { address: auctionHouse, isNative: true },
  //       });
  //       for (const bid of bids.filter((b) => b.canceledAt === null)) {
  //         if (bid.canceledAt) continue;
  //         newOffers.push({
  //           address: bid.metadataAddress.toBase58(),
  //           price: bid.price.basisPoints.toNumber(),
  //           buyer: bid.buyerAddress.toBase58(),
  //           auctionHouse: bid.auctionHouse,
  //           tradeState: bid.tradeStateAddress._bn,
  //           tradeStateBump: bid.tradeStateAddress.bump,
  //         });
  //       }
  //     }
  //     setListings(newListings);
  //     setOffers(newOffers);
  
  //   } catch (err) {
  //     console.error("Error fetching listings: ", err);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   //only fetch listings if we have tokens
  //   if (tokens?.length) fetchListings();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokens]);

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
            <meta name="twitter:image" content={visibleTokens.length ? cdnImage(visibleTokens[0].mint) : user.profile_image} />
          </>
        )}
      </Head>
      {user ? <GalleryNavigation user={user} /> : <MainNavigation />}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        {/* {(showProgress && !uploadAllCompleted) ? (
          <div className="w-full rounded top-0 left-0 flex items-center py-4 gap-4">
            <p className="flex-shrink-0">Optimizing Images: <span>({completed}/{waiting})</span></p>
            <div className="border-2 border-black dark:border-white rounded-full w-full h-3 relative" >
              <div
                style={{ width: `${ progress }%` }}
                className="bg-black dark:bg-white rounded-full h-2 w-0 absolute inset-0 animate-pulse"
              />
            </div>
          </div>
        ) : null
        } */}
        <div className="mx-auto pt-3">

          {(user) && <GalleryContainer tokens={renderedTokens} user={user} uploadAllCompleted={uploadAllCompleted} />}
          {(!user) && (
            <div className="max-w-7xl mx-auto">
              <p className="dark:text-neutral-100 pt-8">
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
