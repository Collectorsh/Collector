import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import getMetadata from "/data/nft/getMetadata";
import { Oval } from "react-loader-spinner";
import Item from "/components/hubs/Item";
import { ToastContainer } from "react-toastify";

export default function List({ hub, refetch }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [inWallet, setInWallet] = useState();
  const [loading, setLoading] = useState(false);

  const asyncGetNfts = useCallback(async (wallet) => {
    if (!wallet || !wallet.publicKey) return;
    setLoading(true);
    const nfts = await getMetadata([wallet.publicKey]);
    setInWallet(nfts);
    setLoading(false);
  }, []);

  useEffect(() => {
    asyncGetNfts(wallet);
  }, [wallet]);

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
      <div className="clear-both mt-6 max-w-screen-2xl mx-auto px-4 sm:px-8 pb-12">
        {!wallet ||
          (!wallet.publicKey && (
            <button
              className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl"
              onClick={(e) => setVisible(true)}
            >
              Connect Wallet
            </button>
          ))}
        <h1 className="mb-6 text-3xl w-fit mx-auto">
          Choose the Artwork that you&apos;d like to list
        </h1>
        {loading && (
          <div className="w-fit mx-auto mt-6">
            <Oval
              color="#fff"
              secondaryColor="#000"
              height={30}
              width={30}
              className="p-0 m-0"
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
          {inWallet &&
            inWallet.map((token, index) => (
              <Item token={token} key={index} hub={hub} refetch={refetch} />
            ))}
        </div>
      </div>
    </>
  );
}
