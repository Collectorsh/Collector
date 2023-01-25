import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import {
  Metaplex,
  walletAdapterIdentity,
  getMerkleProof,
} from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import Moment from "react-moment";
import { MintCountdown } from "/utils/mint/MintCountdown";
import { toDate } from "/utils/mint/utils";
import allowList from "../../zmb_allow.json";

export default function Zmb({ address }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [minted, setMinted] = useState();
  const [holderMax, setHolderMax] = useState();
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
    setMinted(cndy.itemsMinted.toNumber());
    setRemaining(cndy.itemsRemaining.toNumber());
    doSetState(cndy);
    if (onceOnly === false) setTimeout(asyncGetCandymachine, 5000);
  }, []);

  const asyncCheckIfHolder = useCallback(async (wallet) => {
    const holding = allowList.find((a) => a === wallet.publicKey.toBase58());
    holding ? setHolder("yes") : setHolder("no");
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
        await metaplex.candyMachines().callGuardRoute({
          candyMachine,
          group: "holder",
          guard: "allowList",
          settings: {
            path: "proof",
            merkleProof: getMerkleProof(allowList, wallet.publicKey.toBase58()),
          },
        });
        var { nft } = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority,
          group: "holder",
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
            <button className="bg-red-400 px-4 py-3 font-semibold text-black text-lg rounded-xl">
              Sold Out
            </button>
          )}
          {mintState && mintState === "pre" && (
            <>
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
                    You need to be a Unprofessional edition holder to mint now.
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
            className="mt-4 float-right bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl"
            onClick={(e) => setVisible(true)}
          >
            Connect Wallet
          </button>
        </>
      )}
    </>
  );
}
