import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import getDropMints from "/data/drops/getDropMints";
import Items from "./items";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { roundToTwo } from "/utils/roundToTwo";

import { Metaplex } from "@metaplex-foundation/js";
import { connection } from "/config/settings";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import NotFound from "../../../components/404";

export default function Secondary({ drop }) {
  return <NotFound />

  const wallet = useWallet();
  const [mints, setMints] = useState();
  const [stats, setStats] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);
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
          <div className="relative bg-black overflow-hidden text-center pt-8 sm:pt-0 sm:text-left">
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
            <div className="h-96 lg:h-80 relative max-w-screen-2xl mx-auto px-4 sm:px-8">
              {mints && (
                <img
                  src={drop.image}
                  className="w-24 h-24 sm:w-44 sm:h-44 object-center object-cover bg-white p-2 rounded-xl sm:absolute sm:top-12 mx-auto sm:mx-0"
                />
              )}
              <div className="hidden sm:block">
                <Link href={`/drops/${drop.slug}`}>
                  <a className="absolute top-3 right-4 md:right-8 w-fit bg-dark3 hover:bg-dark1 px-4 py-3 rounded-xl font-semibold text-white text-lg cursor-pointer">
                    Back to Drop
                  </a>
                </Link>
              </div>

              <div className="sm:float-left mt-4 sm:mt-12 w-full">
                <div className="sm:ml-48">
                  <h1 className="text-white">{mints && mints.length} Pieces</h1>
                  <h1 className="text-4xl font-bold inline-block tracking-wide text-white">
                    {drop.name}
                  </h1>
                  {stats && (
                    <div className="text-white mt-8 grid grid-cols-3 py-1 w-fit mx-auto sm:mx-0 gap-6">
                      <div className="text-center">
                        <h1 className="text-xl">{stats.sales}</h1>
                        <h1 className="text-lg">Sales</h1>
                      </div>
                      <div className="text-center">
                        <h1 className="text-xl">
                          ◎{roundToTwo(stats.volume / 1000000000)}
                        </h1>
                        <h1 className="text-lg mb-1">Volume</h1>
                      </div>
                      <div className="text-center">
                        <h1 className="text-xl">{stats.listed}</h1>
                        <h1 className="text-lg mb-1">Listed</h1>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="clear-both mt-12 max-w-screen-2xl mx-auto px-4 sm:px-8">
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
        </>
      )}
    </>
  );
}
