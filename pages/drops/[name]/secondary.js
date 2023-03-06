import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
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
    if (!backgroundImage && res.mints.length > 0) {
      setBackgroundImage(
        res.mints[Math.floor(Math.random() * res.mints.length)].mint
      );
    }
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
          <div className="relative bg-black overflow-hidden">
            <div
              className="absolute -top-40 -left-20 -bottom-40 -right-20 opacity-40 object-center object-cover rotate-12"
              style={{
                backgroundImage: `url('https://cdn.collector.sh/${
                  backgroundImage && backgroundImage
                }')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="max-w-7xl mx-auto">
              <div className="px-4 h-96 lg:h-80 relative">
                {mints && (
                  <img
                    src={drop.image}
                    className="w-24 h-24 sm:w-44 sm:h-44 object-center object-cover bg-white p-2 rounded-xl absolute top-4 sm:top-12"
                  />
                )}
                <div className="hidden sm:block">
                  <Link href={`/drops/${drop.slug}`}>
                    <a className="absolute right-0 top-2 right-2 xl:right-0 w-fit bg-dark3 hover:bg-dark1 px-4 py-3 rounded-xl font-semibold text-white text-lg cursor-pointer">
                      Back to Drop
                    </a>
                  </Link>
                </div>

                <div className="float-left mt-4 sm:mt-12 w-full">
                  <div className="ml-28 sm:ml-48">
                    <h1 className="text-3xl font-bold inline-block tracking-wide text-white">
                      {drop.name}
                    </h1>
                    <p className="mt-4 text-white rounded xl:w-1/2">
                      {drop.description}
                    </p>
                  </div>
                  {stats && (
                    <div className="absolute bottom-0 left-4 right-4 sm:w-fit sm:left-auto sm:right-auto my-4 text-black text-bold bg-white bg-opacity-60 rounded-lg">
                      <div className="grid grid-cols-4 py-1">
                        <div
                          className="px-4 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Items</div>
                          <div className="text-lg">{mints && mints.length}</div>
                        </div>
                        <div
                          className="px-4 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Sales</div>
                          <div className="text-lg">{stats.sales}</div>
                        </div>
                        <div
                          className="px-4 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Volume</div>
                          <div className="text-lg">
                            ◎{roundToTwo(stats.volume / 1000000000)}
                          </div>
                        </div>
                        <div
                          className="px-4 border-r"
                          style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                        >
                          <div className="text-sm mb-1">Listed</div>
                          <div className="text-lg">{stats.listed}</div>
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
