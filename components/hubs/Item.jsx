import { useState, useEffect, useContext } from "react";
import { cdnImage } from "/utils/cdnImage";
import SellModal from "/components/single/SellModal";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import ActivitiesContext from "/contexts/activities";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import cancelListingTransaction from "/utils/auctionhouse/CancelListing";
import ListingsContext from "/contexts/listings";

export default function Item({ hub, token, refetch, listed }) {
  const { publicKey, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [sellModal, setSellModal] = useState(false);
  const [activities] = useContext(ActivitiesContext);
  const [tkn, setTkn] = useState();
  const [listings] = useContext(ListingsContext);

  const addDefaultSource = async (e, token) => {
    e.target.src = token.image;
  };

  function handleCloseModal() {
    setSellModal(false);
  }

  useEffect(() => {
    const res = activities.filter(
      (a) =>
        a.mintAddress === token.mintAddress &&
        a.activityType === "listing" &&
        !a.cancelledAt
    );
    if (res.length > 0) console.log(res);
  }, [activities]);

  useEffect(() => {
    getMetadataFromUri(token).then((metadata) => {
      token.image = metadata.image;
      setTkn(token);
    });
  }, []);

  const cancelNftListing = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    const listing = listings.filter((l) => l.mint === token.mint)[0];
    await cancelListingTransaction(
      token,
      listing,
      publicKey,
      signTransaction,
      refetch
    );
  };

  return (
    <>
      {tkn && (
        <>
          <div
            onClick={() => {
              !listed && setSellModal(!sellModal);
            }}
            className={`relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3 ${
              !listed && "cursor-pointer"
            }`}
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src={cdnImage(tkn.mint)}
                className="w-[600px] h-[400px] md:w-[500px] md:h-[300px] object-center object-cover"
                onError={(e) => addDefaultSource(e, tkn)}
              />
            </div>
            <div>
              <div className="w-full">
                <div className="h-fit my-1">
                  <h3 className="text-md text-black dark:text-whitish font-medium">
                    {tkn.name}{" "}
                    {listed && (
                      <span
                        onClick={cancelNftListing}
                        className="float-right rounded-lg bg-greeny text-neutral-800 px-2 py-0.5 text-sm cursor-pointer hover:bg-greenlightbg hover:text-black"
                      >
                        delist
                      </span>
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <SellModal
            open={sellModal}
            token={tkn}
            closeModal={handleCloseModal}
            refetch={refetch}
            auctionHouseAddress={hub.auction_house}
          />
        </>
      )}
    </>
  );
}
