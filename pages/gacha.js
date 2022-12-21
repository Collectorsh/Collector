import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import Moment from "react-moment";

export default function Gacha() {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [holderStartDate, setHolderStartDate] = useState();
  const [publicStartDate, setPublicStartDate] = useState();
  const [cost, setCost] = useState();

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_GACHA_RPC);

  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const asyncGetCandymachine = useCallback(async (wallet, onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    setTotal(cndy.itemsLoaded);
    setRemaining(cndy.itemsRemaining.toNumber());
    const h = cndy.candyGuard.groups.filter((g) => g.label === "holder")[0]
      .guards;
    const p = cndy.candyGuard.groups.filter((g) => g.label === "public")[0]
      .guards;
    setHolderStartDate(h.startDate.date);
    setPublicStartDate(p.startDate.date);
    setCost(h.solPayment.lamports.toNumber());
    if (cndy.itemsRemaining.toNumber() === 0) {
      setMintState("sold");
    } else if (Date.now() < h.startDate.date.toNumber() * 1000) {
      setMintState("pre");
    } else if (
      Date.now() > h.startDate.date.toNumber() * 1000 &&
      Date.now() < h.endDate.date.toNumber() * 1000
    ) {
      setMintState("holder");
    } else if (
      Date.now() > p.startDate.date.toNumber() * 1000 &&
      Date.now() < p.endDate.date.toNumber() * 1000
    ) {
      setMintState("public");
    } else if (Date.now() > p.endDate.date.toNumber() * 1000) {
      setMintState("ended");
    }
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
        setHolder("no");
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

  const mintNow = async (group) => {
    if (isMinting) return;
    setIsMinting(true);
    toast("Approve the transaction in your wallet");
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE),
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    try {
      if (group === "holder") {
        const { nft } = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority,
          group: "holder",
          guards: {
            nftGate: {
              mint: collectionMint.mintAddress,
            },
          },
        });
      } else {
        const { nft } = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority,
          group: "public",
        });
      }
      console.log(nft);
      toast.success(`🎉 Congratulations you minted ${nft.name}`);
    } catch (e) {
      console.log(e);
      try {
        let cause = e.message.split("Caused By: ")[1];
        let msg = cause.split(/\r?\n/)[0];
        // This isn't ideal but there's a race condition where the nft isn't indexed by the rpc node
        // the mint transaction is already successful at this point though so we return a successful message
        if (msg.includes("Account Not Found")) {
          toast.success(`🎉 Congratulations mint successful!`);
        } else {
          toast.error(msg);
        }
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
          <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white">
            <img
              src="/images/gacha.png"
              className="inline w-16 h-16 align-middle rounded-full"
            />
            <h2 className="sm:ml-4 align-middle sm:inline my-5 text-4xl font-bold text-gray-800 w-full py-1 inline-block">
              Collector Studios
            </h2>

            <p className="mt-4">
              Multiple artists, multiple editions, which one will you mint?
            </p>

            <p className="mt-4">
              Collector Studios is a fun way to mint art from artists that you
              know and some that you don&apos;t. All artists share equally in
              the sales and collectors can try their luck to see what they will
              get.
            </p>

            <div className="flex sm:gap-2 mt-6">
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha1.jpeg" />
              </div>
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha2.jpeg" />
              </div>
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha3.jpeg" />
              </div>
            </div>

            {remaining && total && (
              <p className="mt-6 bg-gray-100 p-2 w-ft font-bold">
                Remaining: {remaining}/{total}
              </p>
            )}

            <p className="mt-4 bg-gray-100 p-2 w-ft font-bold">
              Price: {cost && <>◎{roundToTwo(cost / 1000000000)}</>}
            </p>

            {wallet && wallet.publicKey ? (
              <>
                {mintState && mintState === "sold" && (
                  <button className="mt-12 bg-red-400 px-3 py-2 font-semibold text-black text-xl">
                    Sold Out
                  </button>
                )}
                {mintState && mintState === "pre" && (
                  <>
                    {holderStartDate && (
                      <p className="mt-4 text-gray-500">
                        Signature holder mint starts in{" "}
                        <Moment date={holderStartDate} unix fromNow />
                      </p>
                    )}
                    {publicStartDate && (
                      <p className="mt-4 text-gray-500">
                        Public mint starts in{" "}
                        <Moment date={publicStartDate} unix fromNow />
                      </p>
                    )}
                  </>
                )}
                {mintState && mintState === "holder" && (
                  <>
                    {holder === "yes" ? (
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
                            onClick={() => mintNow("holder")}
                            disabled={isMinting}
                          >
                            Mint
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mt-4 text-red-500">
                          You need to be a Collector Signature holder in order
                          to mint now. You can mint your Signature{" "}
                          <Link href="/mint">
                            <a target="_blank" className="font-bold underline">
                              here
                            </a>
                          </Link>
                        </p>
                        {publicStartDate && (
                          <p className="mt-4 text-gray-500">
                            Public mint starts in{" "}
                            <Moment date={publicStartDate} unix fromNow />
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
                {mintState && mintState === "public" && (
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
                        onClick={() => mintNow("public")}
                        disabled={isMinting}
                      >
                        Mint
                      </button>
                    )}
                  </>
                )}
                {mintState && mintState === "ended" && (
                  <p className="mt-12 text-red-500">The mint has ended</p>
                )}
              </>
            ) : (
              <>
                <button
                  className="mt-12 bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer"
                  onClick={(e) => setVisible(true)}
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
