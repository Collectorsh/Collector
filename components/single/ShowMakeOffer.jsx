import React, { useState } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import { useWallet } from "@solana/wallet-adapter-react";
import cancelOfferTransaction from "/utils/auctionhouse/CancelOffer";
import { Oval } from "react-loader-spinner";
import MakeOfferModal from "/components/single/MakeOfferModal";

export default function ShowMakeOffer({ token, refetch, listing, userOffer }) {
  const [offerModal, setOfferModal] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const [processing, setProcessing] = useState(false);

  const cancelNow = async () => {
    setProcessing(true);
    await cancelOfferTransaction(
      userOffer,
      token,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  function handleCloseModal() {
    setOfferModal(false);
  }

  if (publicKey && publicKey.toBase58() === token.owner) return null;
  if (userOffer && listing) return null;

  return (
    <>
      {userOffer ? (
        <>
          {processing ? (
            <Oval
              color="#fff"
              secondaryColor="#000"
              height={50}
              width={50}
              className="p-0 m-0"
            />
          ) : (
            <>
              <button
                className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer mt-0"
                onClick={() => cancelNow(token, userOffer)}
                disabled={processing}
              >
                Cancel Offer ◎{roundToTwo(userOffer.price / 1000000000)}
              </button>
            </>
          )}
        </>
      ) : (
        <button
          className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer"
          onClick={(e) => setOfferModal(!offerModal)}
        >
          Make an Offer
        </button>
      )}
      <MakeOfferModal
        open={offerModal}
        token={token}
        closeModal={handleCloseModal}
        refetch={refetch}
      />
    </>
  );
}
