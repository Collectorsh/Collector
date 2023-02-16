import { useState, useCallback, useEffect } from "react";
import getDropMints from "/data/drops/getDropMints";
import Items from "./items";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";

import { Metaplex } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Secondary({ drop }) {
  const wallet = useWallet();
  const [mints, setMints] = useState();
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
    // Add if owned
    let allOwned = await getOwnedNfts(wallet);
    for (const r of res) {
      if (allOwned.filter((o) => o === r.mint)[0]) {
        r.owned = true;
      } else {
        r.owned = false;
      }
    }
    // Sort and order
    var owned = res.filter((r) => r.owned === true);
    var listed = res.filter((r) => r.listed === true && r.owned === false);
    var notlisted = res.filter(
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
          <h2 className="mt-12 text-4xl font-bold w-full inline-block">
            {drop.name}
          </h2>
          <p className="mt-4 mb-12">{drop.description}</p>
          {mints && infiniteScrollItems.length > 0 ? (
            <InfiniteScroll
              dataLength={infiniteScrollItems.length}
              next={fetchData}
              hasMore={infiniteScrollItems.length !== mints.length}
            >
              <Items items={infiniteScrollItems} />
            </InfiniteScroll>
          ) : (
            <div className="mt-4 w-[50px] mx-auto h-64">
              <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
            </div>
          )}
        </>
      )}
    </>
  );
}
