import React, { useState } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import { useWallet } from "@solana/wallet-adapter-react";
import cancelListingTransaction from "/utils/auctionhouse/CancelListing";
import acceptOfferTransaction from "/utils/auctionhouse/AcceptOffer";
import buyNftTransaction from "/utils/auctionhouse/BuyNft";
import cancelOfferTransaction from "/utils/auctionhouse/CancelOffer";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";

export default function ShowListing({
  token,
  refetch,
  offer,
  listing,
  nft,
  userOffer,
}) {
  const { publicKey, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [processing, setProcessing] = useState(false);

  const cancelNftListing = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    setProcessing(true);
    await cancelListingTransaction(
      token,
      listing,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  const buyNft = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    setProcessing(true);
    await buyNftTransaction(
      token,
      listing,
      nft.creators,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  const acceptNow = async () => {
    setProcessing(true);
    await acceptOfferTransaction(
      offer,
      listing,
      token,
      nft.creators,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  const cancelNow = async (token, offer) => {
    setProcessing(true);
    await cancelOfferTransaction(
      offer,
      token,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  return (
    <>
      {listing && (
        <div className="">
          {publicKey && publicKey.toBase58() === listing.seller ? (
            <div>
              <p className="text-gray-800 dark:text-gray-50">Listing Price</p>
              <p className="text-gray-800 dark:text-gray-50 font-bold text-2xl">
                ◎{roundToTwo(listing.price / 1000000000)}
              </p>
              {processing ? (
                <div className="w-fit mt-6">
                  <Oval
                    color="#fff"
                    secondaryColor="#000"
                    height={50}
                    width={50}
                    className="p-0 m-0"
                  />
                </div>
              ) : (
                <>
                  <button
                    className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer mt-6 mr-3"
                    onClick={cancelNftListing}
                    disabled={processing}
                  >
                    Cancel Listing
                  </button>
                  {offer && (
                    <>
                      <button
                        className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer"
                        onClick={acceptNow}
                        disabled={processing}
                      >
                        Accept Offer ◎{roundToTwo(offer.price / 1000000000)}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <p className="text-gray-800 dark:text-gray-50">Listing Price</p>
              <p className="text-black dark:text-white font-bold text-2xl mb-4">
                ◎{roundToTwo(listing.price / 1000000000)}
              </p>
              {processing ? (
                <div className="w-fit mt-6">
                  <Oval
                    color="#fff"
                    secondaryColor="#000"
                    height={50}
                    width={50}
                    className="p-0 m-0"
                  />
                </div>
              ) : (
                <>
                  <button
                    className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer float-left mr-3"
                    onClick={() => buyNft(token, listing)}
                    disabled={processing}
                  >
                    Buy Now
                  </button>
                  {userOffer && (
                    <button
                      className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer"
                      onClick={() => cancelNow(token, userOffer)}
                      disabled={processing}
                    >
                      Cancel Offer ◎{roundToTwo(userOffer.price / 1000000000)}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
