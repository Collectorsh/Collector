import React, { useState } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import { useWallet } from "@solana/wallet-adapter-react";
import acceptOfferTransaction from "/utils/auctionhouse/AcceptOffer";
import { Oval } from "react-loader-spinner";
import SellModal from "/components/single/SellModal";

export default function ShowSell({ token, refetch, offer, listing, nft }) {
  const [sellModal, setSellModal] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const [processing, setProcessing] = useState(false);

  const acceptNow = async () => {
    setProcessing(true);
    await acceptOfferTransaction(
      offer,
      null,
      token,
      nft.creators,
      publicKey,
      signTransaction,
      refetch
    );
    setProcessing(false);
  };

  function handleCloseModal() {
    setSellModal(false);
  }

  if (listing) return null;
  if (!publicKey) return null;
  if (publicKey.toBase58() !== token.owner) return null;

  return (
    <div>
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
            className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer mr-3"
            onClick={(e) => setSellModal(!sellModal)}
          >
            List Now
          </button>
          <>
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
        </>
      )}
      <SellModal
        open={sellModal}
        token={token}
        closeModal={handleCloseModal}
        refetch={refetch}
      />
    </div>
  );
}
