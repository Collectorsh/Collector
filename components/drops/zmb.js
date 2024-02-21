import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import { MintCountdown } from "/utils/mint/MintCountdown";
import MintedModal from "/components/MintedModal";
import { connection } from "/config/settings";

export default function ZmbMint({ address, drop }) {
  return; //DEPRECATED - TO BE DELETED
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [itemsMinted, setItemsMinted] = useState(0);
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [cost, setCost] = useState();
  const [firstStartDate, setFirstStartDate] = useState();
  const [holder, setHolder] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [minted, setMinted] = useState(false);
  const [mintedNft, setMintedNft] = useState();
  const [numMinted, setNumMinted] = useState();
  const [maxMint, setMaxMint] = useState();
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  function updateOpen(state) {
    setMinted(state);
  }

  const asyncGetCandymachine = useCallback(async (onceOnly = false) => {
    try {
      const cndy = await metaplex.candyMachines().findByAddress({
        address: address,
      });
      setTotal(cndy.itemsLoaded);
      setRemaining(cndy.itemsRemaining.toNumber());
      setItemsMinted(cndy.itemsMinted.toNumber());
      doSetState(cndy);
      if (onceOnly === false) setTimeout(asyncGetCandymachine, 5000);
    } catch (err) {
      setMintState("ended");
      console.log(err);
    }
  }, []);

  useEffect(() => {
    asyncGetCandymachine();
  }, []);

  useEffect(() => {
    if (mintState === "wl") checkIfHolder();
  }, [mintState, wallet]);

  const mintNow = async () => {
    if (isMinting) return;
    setIsMinting(true);
    try {
      toast("Approve the transaction in your wallet");
      const candyMachine = await metaplex.candyMachines().findByAddress({
        address: address,
      });
      const collectionUpdateAuthority = candyMachine.authorityAddress;
      if (mintState === "wl" && holder === "yes" && collectionMint) {
        var args = {
          candyMachine,
          collectionUpdateAuthority,
          group: "wl",
          guards: {
            nftGate: {
              mint: collectionMint.mintAddress,
            },
          },
        };
      } else if (mintState === "public") {
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
      checkIfHolder();
    } catch (err) {
      console.log(err);
      setIsMinting(false);
    }
  };

  const checkIfHolder = async () => {
    if (!wallet || !wallet.publicKey) return;
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: wallet.publicKey,
    });
    var holder = false;
    var count = 0;
    var hasMinted = 0;
    for (const nft of nfts) {
      if (
        nft.collection &&
        nft.collection.address.toBase58() === drop.required_collection
      ) {
        setCollectionMint(nft);
        setHolder("yes");
        holder = true;
        count = count + 1;
      }
      if (
        nft.collection &&
        nft.collection.address.toBase58() === drop.collection_address
      ) {
        const num = nft.name.split("#")[1];
        if (num > 1069) hasMinted = hasMinted + 1;
      }
    }
    setMaxMint(count);
    setNumMinted(hasMinted);
    if (holder === false) setHolder("no");
  };

  const doSetState = (cndy) => {
    if (drop.closed) {
      setMintState("ended");
      return;
    }
    const wlStartDate =
      cndy.candyGuard.groups
        .filter((g) => g.label === "wl")[0]
        .guards.startDate.date.toNumber() * 1000;
    const wlEndDate =
      cndy.candyGuard.groups
        .filter((g) => g.label === "wl")[0]
        .guards.endDate.date.toNumber() * 1000;
    setFirstStartDate(wlStartDate);
    const publicStartDate =
      cndy.candyGuard.groups
        .filter((g) => g.label === "public")[0]
        .guards.startDate.date.toNumber() * 1000;
    const dateNow = Date.now();
    if (dateNow < wlStartDate) {
      setMintState("pre");
    } else if (dateNow > wlStartDate && dateNow < wlEndDate) {
      setMintState("wl");
      const wlPrice = cndy.candyGuard.groups
        .filter((g) => g.label === "wl")[0]
        .guards.solPayment.lamports.toNumber();
      setCost(wlPrice);
    } else if (dateNow > publicStartDate) {
      setMintState("public");
      const publicPrice = cndy.candyGuard.groups
        .filter((g) => g.label === "public")[0]
        .guards.solPayment.lamports.toNumber();
      setCost(publicPrice);
    }
  };

  return (
    <>
      {mintState && (
        <div className="rounded-xl p-4 border-2 border-neutral-100 dark:border-dark3">
          {(mintState === "public" || mintState === "wl") && (
            <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
              MINT LIVE{" "}
              <span className="text-xs font-bold align-middle bg-greeny text-white rounded-lg px-2 py-1 float-right">
                {mintState === "public" ? "public" : "allow"}
              </span>
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
            <div>
              <div className="inline">Starts in </div>
              <MintCountdown
                date={new Date(firstStartDate)}
                style={{
                  justifyContent: "flex-start",
                  marginBottom: "1rem",
                  display: "inline-flex",
                }}
              />
            </div>
          )}
          {total && (
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
              {mintState === "public" && (
                <>{cost && <>◎{roundToTwo(cost / 1000000000)}</>}</>
              )}
              {mintState === "wl" && (
                <>{cost && <>◎{roundToTwo(cost / 1000000000)}</>}</>
              )}
            </p>
          )}
        </div>
      )}
      <div className="mt-4">
        {mintState && (
          <div>
            {(mintState !== "pre" ||
              (mintState === "pre" && drop && drop.market === true)) && (
              <p className="mt-3 float-right text-normal tracking-wide font-semibold text-neutral-800 dark:text-neutral-100 hover:underline">
                <Link href={`/drops/${drop.slug}/market`}>
                  <a>Go to Market</a>
                </Link>
                {/* <ArrowRightIcon
                  className="h-4 w-4 ml-1 inline cursor-pointer"
                  aria-hidden="true"
                /> */}
              </p>
            )}
            {(mintState === "public" || mintState === "wl") && (
              <>
                {wallet && wallet.publicKey ? (
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
                      <>
                        {(mintState === "public" ||
                          (mintState === "wl" &&
                            holder === "yes" &&
                            numMinted < maxMint)) && (
                          <button
                            className="px-4 py-2 text-lg font-semibold cursor-pointer rounded-xl disabled:bg-gray-300 bg-greeny text-black"
                            onClick={() => mintNow()}
                            disabled={isMinting}
                          >
                            Mint
                          </button>
                        )}
                        {mintState === "wl" && holder === "no" && (
                          <p>You don&apos;t have the required NFT to mint</p>
                        )}
                        {mintState === "wl" && holder === "yes" && (
                          <p className="inline ml-2">
                            {numMinted}/{maxMint} minted
                          </p>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl"
                      onClick={(e) => setVisible(true)}
                    >
                      Connect Wallet
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
        <MintedModal open={minted} nft={mintedNft} updateOpen={updateOpen} />
      </div>
    </>
  );
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
