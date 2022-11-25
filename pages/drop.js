import { useCallback, useEffect, useState } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { MintCountdown } from "/utils/mint/MintCountdown";
import Typography from "@material-ui/core/Typography";

export default function DropHome() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [cndyMachine, setCndyMachine] = useState();
  const [mintLive, setMintLive] = useState(false);

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
    setCndyMachine(cndy);
    if (Date.now() > cndy.candyGuard.guards.startDate.date.toNumber())
      setMintLive(true);
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

  const toggleMintButton = () => {
    setMintLive(!mintLive);
  };

  return (
    <>
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto my-12 p-4 shadow-lg bg-white">
            {cndyMachine && (
              <div className="float-right">
                <MintCountdown
                  key="endSettings"
                  date={cndyMachine.candyGuard.guards.startDate.date}
                  style={{ justifyContent: "flex-end" }}
                  status="LIVE"
                  onComplete={toggleMintButton}
                />
                {Date.now() <
                  cndyMachine.candyGuard.guards.startDate.date.toNumber() && (
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    style={{ fontWeight: "bold" }}
                  >
                    TO START OF MINT
                  </Typography>
                )}
              </div>
            )}

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

            <div class="flex gap-2 mt-6">
              <div class="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha1.jpeg" />
              </div>
              <div class="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha2.jpeg" />
              </div>
              <div class="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha3.jpeg" />
              </div>
            </div>

            <div class="flex gap-2 mt-0">
              <div class="flex-1 text-center overflow-hidden">
                <h2 className="font-semibold bg-greeny mb-1 uppercase text-sm py-1">
                  Crypto Vulture
                </h2>
              </div>
              <div class="flex-1 text-center overflow-hidden">
                <h2 className="font-semibold bg-greeny mb-1 uppercase text-sm py-1">
                  Jooski
                </h2>
              </div>
              <div class="flex-1 text-center overflow-hidden">
                <h2 className="font-semibold bg-greeny mb-1 uppercase text-sm py-1">
                  Rupture
                </h2>
              </div>
            </div>

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

            {wallet &&
              wallet.publicKey &&
              holder === "yes" &&
              remaining > 0 &&
              mintLive && (
                <button
                  className="mt-8 bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer"
                  onClick={(e) => mintNow()}
                >
                  Mint
                </button>
              )}

            {wallet &&
              wallet.publicKey &&
              holder === "yes" &&
              remaining > 0 &&
              !mintLive && (
                <button className="mt-8 bg-gray-300 text-gray-400 px-3 py-2 font-semibold text-black text-xl cursor-not-allowed">
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
