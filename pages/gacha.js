import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { MintCountdown } from "/utils/mint/MintCountdown";
import Typography from "@material-ui/core/Typography";
import { Oval } from "react-loader-spinner";

export default function Gacha() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [cndyMachine, setCndyMachine] = useState();
  const [mintLive, setMintLive] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_GACHA_RPC);

  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const asyncGetCandymachine = useCallback(async (wallet, onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    setTotal(cndy.itemsLoaded);
    setRemaining(cndy.itemsRemaining.toNumber());
    setCndyMachine(cndy);
    if (
      (cndy.candyGuard.guards.startDate &&
        !cndy.candyGuard.guards.endDate &&
        Date.now() > cndy.candyGuard.guards.startDate.date.toNumber() * 1000) ||
      (cndy.candyGuard.guards.startDate &&
        cndy.candyGuard.guards.endDate &&
        Date.now() > cndy.candyGuard.guards.startDate.date.toNumber() * 1000 &&
        Date.now() < cndy.candyGuard.guards.endDate.date.toNumber() * 1000)
    )
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
    if (isMinting) return;
    setIsMinting(true);
    toast("Approve the transaction in your wallet");
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    try {
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
      toast.success(`🎉 Congratulations you minted ${nft.name}`);
    } catch (e) {
      console.log(e);
      try {
        let cause = e.message.split("Caused By: ")[1];
        let msg = cause.split(/\r?\n/)[0];
        toast.error(msg);
      } catch (e) {
        console.log(e);
        toast.error("Something went wrong");
      }
    }
    setIsMinting(false);
    asyncGetCandymachine(wallet, true);
  };

  const toggleMintButton = () => {
    setMintLive(!mintLive);
  };

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
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto my-12 p-4 shadow-lg bg-white">
            {cndyMachine &&
              cndyMachine.candyGuard.guards.startDate &&
              Date.now() <
                cndyMachine.candyGuard.guards.startDate.date.toNumber() *
                  1000 && (
                <div className="float-right">
                  <MintCountdown
                    key="endSettings"
                    date={
                      cndyMachine.candyGuard.guards.startDate.date.toNumber() *
                      1000
                    }
                    style={{ justifyContent: "flex-end" }}
                    status="LIVE"
                    onComplete={toggleMintButton}
                  />
                  {Date.now() <
                    cndyMachine.candyGuard.guards.startDate.date.toNumber() *
                      1000 && (
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

            {cndyMachine &&
              cndyMachine.candyGuard.guards.startDate &&
              cndyMachine.candyGuard.guards.endDate &&
              Date.now() >
                cndyMachine.candyGuard.guards.startDate.date.toNumber() *
                  1000 &&
              Date.now() <
                cndyMachine.candyGuard.guards.endDate.date.toNumber() *
                  1000 && (
                <div className="float-right">
                  <MintCountdown
                    key="endSettings"
                    date={
                      cndyMachine.candyGuard.guards.endDate.date.toNumber() *
                      1000
                    }
                    style={{ justifyContent: "flex-end" }}
                    status="ENDED"
                    onComplete={toggleMintButton}
                  />
                  {Date.now() <
                    cndyMachine.candyGuard.guards.endDate.date.toNumber() *
                      1000 && (
                    <Typography
                      variant="caption"
                      align="center"
                      display="block"
                      style={{ fontWeight: "bold" }}
                    >
                      TO END OF MINT
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

            <div className="flex gap-2 mt-6">
              <div className="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha1.jpeg" />
              </div>
              <div className="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha2.jpeg" />
              </div>
              <div className="flex-1 h-64 text-center overflow-hidden">
                <img src="/images/gacha3.jpeg" />
              </div>
            </div>

            <div className="flex gap-2 mt-0">
              <div className="flex-1 text-center overflow-hidden">
                <h2 className="font-semibold bg-greeny mb-1 uppercase text-sm py-1">
                  Crypto Vulture
                </h2>
              </div>
              <div className="flex-1 text-center overflow-hidden">
                <h2 className="font-semibold bg-greeny mb-1 uppercase text-sm py-1">
                  Jooski
                </h2>
              </div>
              <div className="flex-1 text-center overflow-hidden">
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
                <>
                  {isMinting ? (
                    <>
                      <br />
                      <Oval
                        color="#fff"
                        secondaryColor="#000"
                        height={30}
                        width={30}
                        className="p-0 m-0"
                      />
                    </>
                  ) : (
                    <button
                      className="mt-8 bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer disabled:bg-gray-300"
                      onClick={() => mintNow()}
                      disabled={isMinting}
                    >
                      Mint
                    </button>
                  )}
                </>
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
                <Link href="/mint">
                  <a target="_blank" className="font-bold underline">
                    here
                  </a>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
