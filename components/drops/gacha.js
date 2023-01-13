import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import Moment from "react-moment";

export default function Gacha({ address }) {
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
      address: address,
    });
    setTotal(cndy.itemsLoaded);
    setRemaining(cndy.itemsRemaining.toNumber());
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
    if (!wallet || !wallet.publicKey) return;
    asyncGetCandymachine(wallet);
    asyncCheckIfHolder(wallet);
  }, [wallet]);

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
        var { nft } = await metaplex.candyMachines().mint({
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
        var { nft } = await metaplex.candyMachines().mint({
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

  const doSetState = (cndy) => {
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
  };

  return (
    <>
      {remaining && total && (
        <p className="bg-gray-100 dark:bg-dark2 p-2 w-ft font-bold">
          Remaining: {remaining}/{total}
        </p>
      )}

      {cost && (
        <p className="mt-4 bg-gray-100 dark:bg-dark2 p-2 w-ft font-bold">
          Price: {cost && <>◎{roundToTwo(cost / 1000000000)}</>}
        </p>
      )}

      {wallet && wallet.publicKey ? (
        <div className="mt-4">
          {mintState && mintState === "sold" && (
            <button className="bg-red-400 px-3 py-2 font-semibold text-black text-xl">
              Sold Out
            </button>
          )}
          {mintState && mintState === "pre" && (
            <>
              {holderStartDate && (
                <p className="text-gray-500">
                  Signature holder mint starts in{" "}
                  <Moment date={holderStartDate} unix fromNow />
                </p>
              )}
              {publicStartDate && (
                <p className="text-gray-500">
                  Public mint starts{" "}
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
                      className="bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer disabled:bg-gray-300"
                      onClick={() => mintNow("holder")}
                      disabled={isMinting}
                    >
                      Mint
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-red-500">
                    You need to be a Collector Signature holder in order to mint
                    now. You can mint your Signature{" "}
                    <Link href="/mint">
                      <a target="_blank" className="font-bold underline">
                        here
                      </a>
                    </Link>
                  </p>
                  {publicStartDate && (
                    <p className="mt-4 text-gray-500">
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
                  className="bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer disabled:bg-gray-300"
                  onClick={() => mintNow("public")}
                  disabled={isMinting}
                >
                  Mint
                </button>
              )}
            </>
          )}
          {mintState && mintState === "ended" && (
            <p className="text-red-500">The mint has ended</p>
          )}
        </div>
      ) : (
        <>
          <button
            className="mt-4 float-right bg-greeny px-3 py-2 font-semibold text-black text-xl cursor-pointer"
            onClick={(e) => setVisible(true)}
          >
            Connect Wallet
          </button>
        </>
      )}
    </>
  );
}
