import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import { MintCountdown } from "/utils/mint/MintCountdown";
import { connection } from "/config/settings";

export default function Bonk({ address }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [minted, setMinted] = useState();
  const [mintState, setMintState] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [cost, setCost] = useState();
  const [publicStartDate, setPublicStartDate] = useState();
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

  useEffect(() => {
    if (!wallet || !wallet.publicKey) return;
    asyncGetCandymachine(wallet);
  }, [wallet]);

  const mintNow = async () => {
    if (isMinting) return;
    setIsMinting(true);
    toast("Approve the transaction in your wallet");
    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    try {
      const collectionUpdateAuthority = candyMachine.authorityAddress;
      var { nft } = await metaplex.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority,
      });
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
    const publicStart = cndy.candyGuard.guards.startDate.date.toNumber() * 1000;
    setPublicStartDate(publicStart);
    setCost(cndy.candyGuard.guards.tokenPayment.amount.basisPoints.toNumber());
    if (cndy.itemsRemaining.toNumber() === 0) {
      setMintState("sold");
    } else if (Date.now() < publicStart) {
      setMintState("pre");
    } else if (Date.now() > publicStart) {
      setMintState("public");
    }
  };

  return (
    <>
      {remaining && total && (
        <p className="bg-neutral-100 dark:bg-dark2 p-2 w-ft font-bold">
          Remaining: {remaining}/{total}
        </p>
      )}

      {cost && (
        <p className="mt-4 bg-neutral-100 dark:bg-dark2 p-2 w-ft font-bold">
          Price: 4M bonk
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
              {publicStartDate && (
                <MintCountdown
                  date={new Date(publicStartDate)}
                  style={{ justifyContent: "flex-end" }}
                />
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
                  className="bg-greeny px-4 py-2 text-lg font-semibold text-black cursor-pointer rounded-xl disabled:bg-neutral-300"
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
