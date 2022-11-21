import { useContext, useCallback, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function DropHome() {
  const wallet = useWallet();

  const mintNow = async () => {
    const collectionUpdateAuthority = new PublicKey(
      process.env.NEXT_PUBLIC_UPDATE_AUTHORITY
    );
    const connection = new Connection(clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK));
    const metaplex = new Metaplex(connection).use(
      walletAdapterIdentity(wallet)
    );
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    console.log(candyMachine);
    const { nft } = await metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority,
      guards: {
        nftGate: {
          mint: new PublicKey("8xro5M8Lz7VBAZCwSKu84uLgzDiRjYYBn5ptE7gTrVXD"),
        },
      },
    });
    console.log(nft);
  };

  return (
    <>
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 md:gap-10 mt-10">
            <div className="grid md:grid-cols-2 md:gap-2 dark:bg-dark3 bg-gray-50 p-2 rounded-lg">
              <div>
                <img
                  className="rounded-lg mb-2"
                  src="https://arweave.net/ny32VOK2vWQkaNFbcw7IIEfFTnrpH5paYOsbIIR98ic?ext=png"
                />
                <img
                  className="rounded-lg"
                  src="https://arweave.net/gzLfBofb7jLjJS-MeNI2e7Tv2NYtCKj4GB8xS6d_hoA?ext=png"
                />
              </div>
              <div>
                <img
                  className="rounded-lg"
                  src="https://arweave.net/ny32VOK2vWQkaNFbcw7IIEfFTnrpH5paYOsbIIR98ic?ext=png"
                />
                <h1 className="text-7xl text-center mt-16">?</h1>
              </div>
            </div>
            <div className="relative mb-10 dark:text-whitish">
              <h1 className="text-3xl font-bold">3 Artists</h1>
              <h2 className="text-lg">10 editions each</h2>
              <h1 className="text-3xl font-bold mt-6">
                Which one will you get?
              </h1>
              <p className="mb-2 text-red-600 text-sm">
                Connect your wallet to continue
              </p>
              <div className="absolute top-12"></div>
              <p className="text-left text-3xl font-bold mb-5 mt-12"></p>
              <p className="text-left text-2xl font-bold"></p>
              <button
                className="rounded bg-gray-300 px-1 py-0.5 mt-1 font-semibold text-black text-xs cursor-pointer"
                onClick={mintNow}
              >
                Mint
              </button>
              <p className="text-left text-lg font-bold mb-3">Description</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
