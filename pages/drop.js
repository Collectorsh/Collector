import { useCallback, useEffect, useState } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function DropHome() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [collectionMint, setCollectionMint] = useState();

  const connection = new Connection(
    clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK)
  );

  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const asyncGetCandymachine = useCallback(async (wallet, onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    setTotal(cndy.itemsLoaded);
    setRemaining(cndy.itemsRemaining.toNumber());
    if (onceOnly === false) setTimeout(asyncGetCandymachine, 5000);
  }, []);

  const asyncCheckIfHolder = useCallback(async (wallet) => {
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: wallet.publicKey,
    });
    var holder = false;
    for (const nft of nfts) {
      if (
        nft.collection &&
        nft.collection.address.toBase58() ===
          process.env.NEXT_PUBLIC_SIGNATURE_COLLECTION_ADDRESS
      ) {
        setCollectionMint(nft);
        setHolder("yes");
        holder = true;
      }
    }
    if (holder === false) setHolder("no");
  }, []);

  useEffect(() => {
    if (!wallet || !wallet.publicKey) return;
    asyncGetCandymachine(wallet);
    asyncCheckIfHolder(wallet);
  }, [wallet]);

  const mintNow = async () => {
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    const { nft } = await metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority,
      guards: {
        nftGate: {
          mint: collectionMint.mintAddress,
        },
      },
    });
    console.log(nft);
    asyncGetCandymachine(wallet, true);
  };

  return (
    <>
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto mt-12 p-4 shadow-lg bg-white">
            <img
              src="/images/gacha.jpg"
              className="inline w-16 h-16 align-middle"
            />
            <h2 className="align-middle inline my-5 text-4xl font-bold text-gray-800 w-full py-1 inline-block">
              Collector Gacha
            </h2>

            <p className="mt-4">
              Multiple artists, multiple editions, which one will you mint?
            </p>

            <p className="mt-4">
              The Collector Gacha is a fun way to mint art from artists that you
              know and some that you don&apos;t. All artists share equally in
              the sales and collectors can try their luck to see what they will
              get.
            </p>

            {remaining && total && (
              <p className="mt-6 bg-gray-100 p-2 w-ft font-bold">
                Remaining: {remaining}/{total}
              </p>
            )}

            <p className="mt-4 bg-gray-100 p-2 w-ft font-bold">Price: 1 SOL</p>

            {!wallet ||
              (!wallet.publicKey && (
                <button
                  className="mt-12 bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer"
                  onClick={(e) => setVisible(true)}
                >
                  Connect Wallet
                </button>
              ))}

            {wallet &&
              wallet.publicKey &&
              holder === "yes" &&
              remaining === 0 && (
                <button className="mt-12 bg-red-400 px-3 py-2 font-semibold text-black text-xl">
                  Sold Out
                </button>
              )}

            {wallet && wallet.publicKey && holder === "yes" && remaining > 0 && (
              <button
                className="mt-8 bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer"
                onClick={(e) => mintNow()}
              >
                Mint
              </button>
            )}

            {wallet && wallet.publicKey && holder === "no" && (
              <p className="mt-12 text-red-500">
                You need to be a Collector Signature holder in order to
                participate. You can mint yours{" "}
                <a href="/mint" target="_blank" className="font-bold underline">
                  here
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
