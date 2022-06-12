import React, { useState, useEffect, useContext } from "react";
import TokenDetails from "/components/single/TokenDetails";
import Attributes from "/components/single/Attributes";
import ShowActivities from "/components/single/ShowActivities";
import Link from "next/link";
import ShareToTwitter from "/components/ShareToTwitter";
import { host } from "/config/settings";
import ShowListing from "/components/single/ShowListing";
import ShowSell from "/components/single/ShowSell";
import ShowMakeOffer from "/components/single/ShowMakeOffer";
import { ToastContainer } from "react-toastify";
import Image from "/components/Image";
import SingleNftContext from "/contexts/single_nft";
import { sortHighestListing } from "/utils/sortHighestListing";
import { sortHighestOffer } from "/utils/sortHighestOffer";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Single({ token, refetch }) {
  console.log(token);
  const { publicKey } = useWallet();
  const [singleNft] = useContext(SingleNftContext);
  const [listing, setListing] = useState();
  const [offer, setOffer] = useState(false);
  const [userOffer, setUserOffer] = useState(false);

  // Find the highest offer
  useEffect(() => {
    if (!singleNft.offers) return;
    let highest = sortHighestOffer(singleNft.offers);
    setOffer(highest);
  }, [singleNft.offers]);

  // Find the highest listing
  useEffect(() => {
    if (!singleNft.listings) return;
    let listing = sortHighestListing(token, singleNft.listings);
    setListing(listing);
  }, [singleNft.listings]);

  // Find offer from logged in user pubkey
  useEffect(() => {
    setUserOffer();
    if (!publicKey) return;
    if (!singleNft.offers) return;
    let off = singleNft.offers.find((o) => o.buyer === publicKey.toBase58());
    if (!off) return;
    setUserOffer(off);
  }, [singleNft.offers]);

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="mb-8 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:mb-0 mt-24 md:mt-32 overflow-hidden">
        <div className="overflow-hidden lg:block col-span-1 mb-8 lg:mr-8 relative">
          <Image token={token} size="large" />
        </div>
        <div className="col-span-1 mb-8">
          <h1 className="text-4xl mb-2 dark:text-white tracking-wide">
            {token.name}
          </h1>
          {token.artist_name && (
            <p className="text-black dark:text-white text-semibold inline">
              <span className="font-semibold text-sm">{token.artist_name}</span>
            </p>
          )}
          {token.artist_name && token.artist_twitter && (
            <p className="text-black dark:text-white text-semibold inline mx-2 text-sm">
              {"//"}
            </p>
          )}
          {token.artist_twitter && (
            <>
              <Link
                href={`https://twitter.com/${token.artist_twitter}`}
                title={token.artist_twitter}
              >
                <a>
                  <p className="text-black dark:text-white text-semibold inline text-sm">
                    {token.artist_twitter}
                  </p>
                </a>
              </Link>
              <p className="text-black dark:text-white text-semibold inline ml-2 text-sm">
                {"//"}
              </p>
            </>
          )}
          <p className="inline">
            <ShareToTwitter
              url={`${host}/nft/${token.mint}`}
              size="18"
              text="Tweet It"
            />
          </p>
          {token.description && (
            <p className="my-4 text-black dark:text-white text-sm">
              {token.description}
            </p>
          )}
          <div className="mt-8">
            <ShowListing
              token={token}
              refetch={refetch}
              offer={offer}
              listing={listing}
              nft={singleNft}
              userOffer={userOffer}
            />
            <ShowSell
              token={token}
              refetch={refetch}
              offer={offer}
              listing={listing}
              nft={singleNft}
            />
            <ShowMakeOffer
              token={token}
              refetch={refetch}
              listing={listing}
              userOffer={userOffer}
            />
          </div>
          <ShowActivities token={token} />
          <TokenDetails token={token} />
          {token.attributes && Array.isArray(token.attributes) && (
            <Attributes token={token} />
          )}
        </div>
      </div>
    </>
  );
}
