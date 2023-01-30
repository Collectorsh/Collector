import { useCallback, useEffect, useState } from "react";
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
import { MintCountdown } from "/utils/mint/MintCountdown";
import whiteList from "../../zmb_allow.json";

export default function Zmb({ address }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [collectionMint, setCollectionMint] = useState();
  const [signatureHolder, setSignatureHolder] = useState();
  const [allowList, setAllowList] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [minted, setMinted] = useState();
  const [mintMax, setMintMax] = useState();
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [cost, setCost] = useState();

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_GACHA_RPC);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const holderStartDate = Date.parse("30 Jan 2023 15:00:00 GMT");
  const publicStartDate = Date.parse("30 Feb 2023 15:00:00 GMT");

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
    const allow = whiteList.find(
      (a) => a.holder === wallet.publicKey.toBase58()
    );
    if (allow) {
      console.log("on allow list");
      console.log(`mint max: ${allow.max}`);
      setAllowList("yes");
      setSignatureHolder("no");
      setMintMax(allow.max);
    } else {
      console.log("not on allow list");
      setAllowList("no");
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
          console.log("signature nft holder");
          console.log("mint max: 1");
          setCollectionMint(nft);
          setSignatureHolder("yes");
          holder = true;
          setMintMax(1);
        }
      }
      if (holder === false) setSignatureHolder("no");
    }
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
      address: address,
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    try {
      if (allowList === "yes") {
        const groupName = `unp_${mintMax.toString()}`;
        console.log(`minting from group: ${groupName}`);
        await metaplex.candyMachines().callGuardRoute({
          candyMachine,
          group: groupName,
          guard: "allowList",
          settings: {
            path: "proof",
            merkleProof: getMerkleProof(
              whiteList.filter((w) => w.max === mintMax).map((w) => w.holder),
              wallet.publicKey.toBase58()
            ),
          },
        });
        var { nft } = await metaplex.candyMachines().mint({
          candyMachine,
          collectionUpdateAuthority,
          group: groupName,
        });
      } else if (signatureHolder === "yes") {
        console.log(`minting from group: holder`);
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
        console.log("minting from group: public");
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
    setCost(cndy.candyGuard.guards.solPayment.lamports.toNumber());
    if (cndy.itemsRemaining.toNumber() === 0) {
      setMintState("sold");
    } else if (Date.now() < holderStartDate) {
      setMintState("pre");
    } else if (Date.now() > holderStartDate && Date.now() < publicStartDate) {
      setMintState("holder");
    } else if (Date.now() > publicStartDate) {
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
                  date={new Date(holderStartDate)}
                  style={{ justifyContent: "flex-end" }}
                />
              )}
            </>
          )}
          {mintState && mintState === "holder" && (
            <>
              {allowList === "yes" || signatureHolder === "yes" ? (
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
                    <>
                      <p className="text-sm mb-2">
                        You're eligible to mint {mintMax} during presale
                      </p>
                      <button
                        className="bg-greeny px-4 py-2 rounded-xl font-semibold text-black text-lg cursor-pointer disabled:cursor-default disabled:bg-gray-300"
                        onClick={() => mintNow()}
                        disabled={isMinting ? true : false}
                      >
                        Mint
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {publicStartDate && (
                    <MintCountdown
                      date={new Date(publicStartDate)}
                      style={{ justifyContent: "flex-end" }}
                    />
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
                  onClick={() => mintNow()}
                  disabled={isMinting}
                >
                  Mint
                </button>
              )}
            </>
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
