import { useState, useCallback, useEffect } from "react";
import getDropMints from "/data/drops/getDropMints";
import Items from "./items";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { roundToTwo } from "/utils/roundToTwo";

import { Metaplex } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Secondary({ drop }) {
  const wallet = useWallet();
  const [mints, setMints] = useState();
  const [stats, setStats] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection);

  // Get owned NFT's
  const getOwnedNfts = useCallback(async (wallet) => {
    try {
      const nfts = await metaplex.nfts().findAllByOwner({
        owner: wallet.publicKey.toBase58(),
      });
      return nfts.map((n) => n.mintAddress.toBase58());
    } catch (err) {
      return [];
    }
  }, []);

  // Get the drop mints
  const asyncGetDropMints = useCallback(async (id, wallet) => {
    let res = await getDropMints(id);
    setStats(res.stats);
    setBackgroundImage(
      res.mints[Math.floor(Math.random() * res.mints.length)].mint
    );
    // Add if owned
    let allOwned = await getOwnedNfts(wallet);
    for (const r of res.mints) {
      if (allOwned.filter((o) => o === r.mint)[0]) {
        r.owned = true;
      } else {
        r.owned = false;
      }
    }
    // Sort and order
    var owned = res.mints.filter((r) => r.owned === true);
    var listed = res.mints.filter(
      (r) => r.listed === true && r.owned === false
    );
    var notlisted = res.mints.filter(
      (r) => r.listed === undefined && r.owned === false
    );
    listed = listed.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    setMints(owned.concat(listed).concat(notlisted));
  }, []);

  useEffect(() => {
    asyncGetDropMints(drop.id, wallet);
  }, [wallet]);

  useEffect(() => {
    if (!mints) return;

    setInfiniteScrollItems(mints.slice(0, 20));
  }, [mints]);

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      mints.slice(0, currentDisplayedItems.length + 20)
    );
  }

  return (
    <>
      {drop && (
        <>
          <div
            style={{
              backgroundImage: `url('https://cdn.collector.sh/${
                backgroundImage && backgroundImage
              }')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="px-4 h-96 lg:h-80 relative">
                {mints && (
                  <img
                    src={`https://cdn.collector.sh/${
                      backgroundImage && backgroundImage
                    }`}
                    className="w-44 h-44 object-center object-cover bg-white p-2 absolute top-12 rounded-xl"
                  />
                )}
                <div className="float-left mt-12 w-full">
                  <div className="ml-48">
                    <h1 className="text-3xl font-bold inline-block tracking-wide text-white">
                      {drop.name}
                    </h1>
                    <p className="mt-4 bg-dark1 text-white p-2 rounded bg-opacity-20 xl:w-1/2">
                      {drop.description}
                    </p>
                  </div>
                  {stats && (
                    <div className="float-right w-fit my-4 text-black text-bold bg-white bg-opacity-40 rounded-lg">
                      <div className="grid grid-cols-3 py-1">
                        <div
                          className="px-6 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Volume</div>
                          <div className="text-lg">
                            ◎{roundToTwo(stats.volume / 1000000000)}
                          </div>
                        </div>
                        <div
                          className="px-6 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Listed</div>
                          <div className="text-lg">{stats.listed}</div>
                        </div>
                        <div className="px-6">
                          <div className="text-sm mb-1">Floor</div>
                          <div className="text-lg">
                            ◎{roundToTwo(stats.floor / 1000000000)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="px-4 xl:px-0">
              <div className="clear-both mt-12">
                {mints ? (
                  <InfiniteScroll
                    dataLength={infiniteScrollItems.length}
                    next={fetchData}
                    hasMore={infiniteScrollItems.length !== mints.length}
                  >
                    <Items items={infiniteScrollItems} />
                  </InfiniteScroll>
                ) : (
                  <div className="mt-4 w-[50px] mx-auto h-64">
                    <Oval
                      color="#fff"
                      secondaryColor="#000"
                      height={50}
                      width={50}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
