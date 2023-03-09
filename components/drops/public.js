import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { roundToTwo } from "/utils/roundToTwo";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import { MintCountdown } from "/utils/mint/MintCountdown";
import MintedModal from "/components/MintedModal";

export default function PublicMint({ address }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [itemsMinted, setItemsMinted] = useState();
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [cost, setCost] = useState();
  const [publicStartDate, setPublicStartDate] = useState();
  const [holder, setHolder] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [minted, setMinted] = useState(false);
  const [mintedNft, setMintedNft] = useState();

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  function updateOpen(state) {
    setMinted(state);
  }

  const asyncGetCandymachine = useCallback(async (onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    setTotal(cndy.itemsLoaded);
    setRemaining(cndy.itemsRemaining.toNumber());
    setItemsMinted(cndy.itemsMinted.toNumber());
    doSetState(cndy);
    if (onceOnly === false) setTimeout(asyncGetCandymachine, 5000);
  }, []);

  useEffect(() => {
    asyncGetCandymachine();
  }, []);

  useEffect(() => {
    if (mintState === "signature") checkIfHolder();
  }, [mintState, wallet]);

  const mintNow = async () => {
    if (isMinting) return;
    setIsMinting(true);
    toast("Approve the transaction in your wallet");
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    if (mintState === "signature" && holder === "yes" && collectionMint) {
      var args = {
        candyMachine,
        collectionUpdateAuthority,
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
        console.log("failed: sleeping before trying again");
        await sleep(2000);
      }
    }
    setIsMinting(false);
    asyncGetCandymachine(wallet, true);
  };

  const checkIfHolder = async () => {
    if (!wallet || !wallet.publicKey) return;
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
  };

  const doSetState = (cndy) => {
    const isGated = cndy.candyGuard.guards.nftGate;
    const publicStart = cndy.candyGuard.guards.startDate.date.toNumber() * 1000;
    if (cndy.candyGuard.guards.endDate) {
      var publicEnd = cndy.candyGuard.guards.endDate.date.toNumber() * 1000;
    }
    setPublicStartDate(publicStart);
    setCost(cndy.candyGuard.guards.solPayment.lamports.toNumber());
    if (cndy.itemsRemaining.toNumber() === 0) {
      setMintState("sold");
    } else if (Date.now() < publicStart) {
      setMintState("pre");
    } else if (Date.now() > publicStart) {
      if (publicEnd && Date.now() > publicEnd) {
        setMintState("ended");
      } else {
        if (isGated) {
          setMintState("signature");
        } else {
          setMintState("public");
        }
      }
    }
  };

  return (
    <>
      {itemsMinted && total && (
        <p className="bg-gray-100 dark:bg-dark2 p-2 w-ft font-bold">
          Minted: {itemsMinted}/{total}
        </p>
      )}

      {cost && (
        <p className="mt-4 bg-gray-100 dark:bg-dark2 p-2 w-ft font-bold">
          Price: {cost && <>◎{roundToTwo(cost / 1000000000)}</>}
        </p>
      )}

      <div className="mt-4">
        {mintState && mintState === "sold" && (
          <button className="bg-red-400 px-4 py-3 font-semibold text-black text-lg rounded-xl">
            Sold Out
          </button>
        )}
        {mintState && mintState === "pre" && (
          <>
            {publicStartDate && (
              <MintCountdown
                date={new Date(publicStartDate)}
                style={{ justifyContent: "flex-end", marginBottom: "1rem" }}
              />
            )}
          </>
        )}
        {mintState && mintState === "public" && (
          <>
            {wallet && wallet.publicKey ? (
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
        )}
        {mintState && mintState === "signature" && (
          <>
            {wallet && wallet.publicKey ? (
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
                    {holder === "yes" && (
                      <button
                        className="bg-greeny px-4 py-2 text-lg font-semibold text-black cursor-pointer rounded-xl disabled:bg-gray-300"
                        onClick={() => mintNow()}
                        disabled={isMinting}
                      >
                        Mint
                      </button>
                    )}
                    {holder === "no" && (
                      <p>You need to be a signature holder to participate</p>
                    )}
                  </>
                )}
              </>
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
        )}
        {mintState && mintState === "ended" && (
          <>
            <button className="bg-dark3 px-4 py-2 text-lg font-semibold text-white rounded-xl cursor-default">
              Ended
            </button>
          </>
        )}
      </div>
      <MintedModal open={minted} nft={mintedNft} updateOpen={updateOpen} />
    </>
  );
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
