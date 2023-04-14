import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import Moment from "react-moment";
import { MintCountdown } from "/utils/mint/MintCountdown";
import { toDate } from "/utils/mint/utils";
import { ArrowRightIcon } from "@heroicons/react/outline";
import { connection } from "/config/settings";

export default function Gacha({ address, drop }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [itemsMinted, setItemsMinted] = useState();
  const [holderMax, setHolderMax] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [holderStartDate, setHolderStartDate] = useState();
  const [publicStartDate, setPublicStartDate] = useState();
  const [cost, setCost] = useState();
  const [minted, setMinted] = useState(false);
  const [mintedNft, setMintedNft] = useState();
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const asyncGetCandymachine = useCallback(async (wallet, onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    setTotal(cndy.itemsLoaded);
    setMinted(cndy.itemsMinted.toNumber());
    setRemaining(cndy.itemsRemaining.toNumber());
    setItemsMinted(cndy.itemsMinted.toNumber());
    doSetState(cndy);
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
    asyncGetCandymachine();
  }, []);

  useEffect(() => {
    if (mintState === "holder") checkIfHolder();
  }, [mintState, wallet]);

  const mintNow = async (group) => {
    if (isMinting) return;
    setIsMinting(true);
    toast("Approve the transaction in your wallet");
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    try {
      if (group === "holder") {
        var args = {
          candyMachine,
          collectionUpdateAuthority,
          group: "holder",
          guards: {
            nftGate: {
              mint: collectionMint.mintAddress,
            },
          },
        };
      } else {
        var args = {
          candyMachine,
          collectionUpdateAuthority,
          group: "public",
        };
      }
      const transactionBuilder = await metaplex
        .candyMachines()
        .builders()
        .mint(args);
      const { tokenAddress } = transactionBuilder.getContext();
      await metaplex.rpc().sendAndConfirmTransaction(transactionBuilder);
      var nft;
      while (!nft) {
        try {
          nft = await metaplex.nfts().findByToken({ token: tokenAddress });
          setMinted(true);
          setMintedNft(nft);
        } catch (err) {
          await sleep(2000);
        }
      }
      setIsMinting(false);
      asyncGetCandymachine(wallet, true);
    } catch (e) {
      setIsMinting(false);
    }
  };

  const doSetState = (cndy) => {
    const h = cndy.candyGuard.groups.filter((g) => g.label === "holder")[0]
      .guards;
    const p = cndy.candyGuard.groups.filter((g) => g.label === "public")[0]
      .guards;
    setHolderStartDate(h.startDate.date);
    setPublicStartDate(p.startDate.date);
    setCost(h.solPayment.lamports.toNumber());
    if (h.redeemedAmount) {
      setHolderMax(h.redeemedAmount.maximum.toNumber());
    }
    if (cndy.itemsRemaining.toNumber() === 0) {
      setMintState("sold");
    } else if (Date.now() < h.startDate.date.toNumber() * 1000) {
      setMintState("pre");
    } else if (
      Date.now() > h.startDate.date.toNumber() * 1000 &&
      Date.now() < h.endDate.date.toNumber() * 1000
    ) {
      setMintState("holder");
    } else if (p.endDate && Date.now() > p.endDate.date.toNumber() * 1000) {
      setMintState("ended");
    } else if (Date.now() > p.startDate.date.toNumber() * 1000) {
      setMintState("public");
    }
  };

  return (
    <>
      {mintState && (
        <div className="rounded-xl p-4 border-2 border-neutral-100 dark:border-dark3">
          {(mintState === "public" || mintState === "signature") && (
            <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
              MINT LIVE
            </p>
          )}
          {mintState === "ended" && (
            <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
              MINT FINISHED
            </p>
          )}
          {mintState === "sold" && (
            <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
              SOLD OUT
            </p>
          )}
          {mintState === "pre" && (
            <>
              <div className="inline">Starts in </div>
              {holderStartDate && (
                <MintCountdown
                  date={toDate(holderStartDate)}
                  style={{ justifyContent: "flex-end" }}
                />
              )}
              {!holderStartDate && publicStartDate && (
                <MintCountdown
                  date={toDate(publicStartDate)}
                  style={{ justifyContent: "flex-end" }}
                />
              )}
            </>
          )}
          {itemsMinted && total && (
            <>
              <p className="my-2 font-semibold text-neutral-700 dark:text-neutral-200">
                {Math.round((itemsMinted / total) * 100)}% minted{" "}
                <span className="font-normal">
                  ({itemsMinted}/{total})
                </span>
              </p>
              <div className="h-1 bg-gray-100 w-full">
                <div
                  className="h-1 bg-greeny"
                  style={{
                    width: `${Math.round((itemsMinted / total) * 100)}%`,
                  }}
                ></div>
              </div>
            </>
          )}

          {cost && mintState !== "ended" && (
            <p className="mt-2 text-xl font-semibold">
              {cost && <>◎{roundToTwo(cost / 1000000000)}</>}
            </p>
          )}
        </div>
      )}

      {mintState !== "pre" && (
        <p className="mt-6 float-right text-normal tracking-wide font-semibold text-neutral-800 dark:text-neutral-100 hover:underline">
          <Link href={`/drops/${drop.slug}/market`}>
            <a>Go to Market</a>
          </Link>
          <ArrowRightIcon
            className="h-4 w-4 ml-1 inline cursor-pointer"
            aria-hidden="true"
          />
        </p>
      )}

      {wallet && wallet.publicKey ? (
        <div className="mt-4">
          {mintState && mintState === "holder" && (
            <>
              {holderMax && (
                <p className="mb-4 text-sm">
                  Signature holder allocation is {holderMax}. Minted {minted}/
                  {holderMax}
                </p>
              )}
              {holder === "yes" ? (
                <>
                  {isMinting ? (
                    <>
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
                      className="bg-greeny px-4 py-2 rounded-xl font-semibold text-black text-lg cursor-pointer disabled:cursor-default disabled:bg-gray-300"
                      onClick={() => mintNow("holder")}
                      disabled={
                        isMinting
                          ? true
                          : holderMax
                          ? minted === holderMax
                          : false
                      }
                    >
                      Mint
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm">
                    You need to be a Collector Signature holder in order to mint
                    now. You can mint your Signature{" "}
                    <Link href="/mint">
                      <a target="_blank" className="font-bold underline">
                        here
                      </a>
                    </Link>
                  </p>
                  {publicStartDate && (
                    <p className="mt-4 text-sm">
                      Public mint starts{" "}
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
                  className="bg-greeny px-4 py-2 text-lg font-semibold text-black cursor-pointer rounded-xl disabled:bg-gray-300"
                  onClick={() => mintNow("public")}
                  disabled={isMinting}
                >
                  Mint
                </button>
              )}
            </>
          )}
          {mintState && mintState === "ended" && (
            <p className="text-red-500 text-sm">The mint has ended</p>
          )}
        </div>
      ) : (
        <>
          <button
            className="mt-4 bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl"
            onClick={(e) => setVisible(true)}
          >
            Connect Wallet
          </button>
        </>
      )}
    </>
  );
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
