import React, { useState, useEffect, useContext, useCallback } from "react";
import TokenDetails from "/components/single/TokenDetails";
import ShowActivities from "/components/single/ShowActivities";
import ShowListing from "/components/single/ShowListing";
import ShowSell from "/components/single/ShowSell";
import ShowMakeOffer from "/components/single/ShowMakeOffer";
import { ToastContainer } from "react-toastify";
import Image from "/components/Image";
import SingleNftContext from "/contexts/single_nft";
import { sortHighestListing } from "/utils/sortHighestListing";
import { sortHighestOffer } from "/utils/sortHighestOffer";
import { useWallet } from "@solana/wallet-adapter-react";
import getOwnerCollectorName from "/data/getOwnerCollectorName";
import Meta from "/components/single/Meta";

export default function Single({ token, refetch }) {
  const { publicKey } = useWallet();
  const [singleNft] = useContext(SingleNftContext);
  const [listing, setListing] = useState();
  const [offer, setOffer] = useState(false);
  const [userOffer, setUserOffer] = useState(false);
  const [collector, setCollector] = useState();

  // Find the owners name
  const asyncGetUser = useCallback(async (address) => {
    let res = await getOwnerCollectorName(address);
    if (res.status === "success") setCollector(res);
  }, []);

  useEffect(() => {
    asyncGetUser(token.owner);
  }, [token]);

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
  }, [singleNft.offers, publicKey]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 mt-12">
        <div className="col-span-1">
          <Image token={token} size="max" />
        </div>
        <div className="col-span-1">
          <h1 className="text-4xl mb-2 dark:text-white tracking-wide">
            {token.name}
          </h1>

          {token.description && (
            <p className="mt-4 mb-8 text-black dark:text-white text-sm">
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
          <Meta token={token} collector={collector} />
        </div>
      </div>
      <div className="pb-12 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-48">
        <div className="col-span-1">
          <TokenDetails token={token} />
        </div>
        <div className="col-span-1">
          <ShowActivities token={token} />
        </div>
      </div>
    </>
  );
}
