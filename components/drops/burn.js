import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Oval } from "react-loader-spinner";
import posters from "../../posters.json";
import { connection } from "/config/settings";

export default function Burn({ address }) {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [holder, setHolder] = useState();
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState();
  const [minted, setMinted] = useState();
  const [collectionMint, setCollectionMint] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const asyncGetCandymachine = useCallback(async (wallet, onceOnly = false) => {
    const cndy = await metaplex.candyMachines().findByAddress({
      address: address,
    });
    setTotal(cndy.itemsLoaded);
    setMinted(cndy.itemsMinted.toNumber());
    setRemaining(cndy.itemsRemaining.toNumber());
    if (onceOnly === false) setTimeout(asyncGetCandymachine, 5000);
  }, []);

  const asyncCheckIfHolder = useCallback(async (wallet) => {
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: wallet.publicKey,
    });
    var holder = false;
    for (const nft of nfts) {
      if (posters.find((p) => p === nft.mintAddress.toBase58())) {
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
      address: address,
    });
    const collectionUpdateAuthority = candyMachine.authorityAddress;
    try {
      var { nft } = await metaplex.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority,
        guards: {
          nftBurn: {
            mint: collectionMint.mintAddress,
          },
        },
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

  return (
    <>
      <h2 className="mb-4 font-bold text-xl">Poster Burn Party</h2>
      {remaining && total && (
        <p className="bg-neutral-100 dark:bg-dark2 p-2 w-ft font-bold">
          Remaining: {remaining}/{total}
        </p>
      )}

      {wallet && wallet.publicKey ? (
        <div className="mt-4">
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
                    className="bg-red-500 px-4 py-2 rounded-xl font-semibold text-black text-lg cursor-pointer disabled:cursor-default disabled:bg-neutral-300"
                    onClick={() => mintNow()}
                    disabled={isMinting}
                  >
                    Burn Poster
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-sm">
                  You didn&apos;t get rugged by minting a poster 🎉
                </p>
              </>
            )}
          </>
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
