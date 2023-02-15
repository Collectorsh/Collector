import { useState, useCallback, useEffect } from "react";
import getDropMints from "/data/drops/getDropMints";
import Items from "./items";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";

import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const axios = require("axios");

export default function Secondary({ drop }) {
  const wallet = useWallet();
  const [mints, setMints] = useState();
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  // Get owned NFT's
  const getOwnedNfts = useCallback(async () => {
    try {
      const nfts = await metaplex.nfts().findAllByOwner({
        owner: metaplex.identity().publicKey,
      });
      return nfts.map((n) => n.mintAddress.toBase58());
    } catch (err) {
      return [];
    }
  }, []);

  // Get active ME listings
  const getActiveListings = async () => {
    try {
      const url = `https://api.helius.xyz/v1/active-listings?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
      const { data } = await axios.post(url, {
        query: {
          marketplaces: ["MAGIC_EDEN"],
          firstVerifiedCreators: [drop.creator],
        },
      });
      return data.result;
    } catch (err) {
      return [];
    }
  };

  // Get the drop mints
  const asyncGetDropMints = useCallback(async (id) => {
    let res = await getDropMints(id);
    // Add ME listing details
    let meListings = await getActiveListings();
    for (const meListing of meListings) {
      const r = res.filter((r) => r.mint === meListing.mint)[0];
      if (!r || r.listed === true || !meListing.activeListings[0]) continue;
      r.listed = true;
      r.amount = meListing.activeListings[0].amount;
      r.source = "magiceden";
    }
    // Add if owned
    let owned = await getOwnedNfts();
    for (const r of res) {
      if (owned.filter((o) => o === r.mint)[0]) {
        r.owned = true;
      } else {
        r.owned = false;
      }
    }
    // Sort and order
    var listed = res.filter((r) => r.listed === true);
    var notlisted = res.filter((r) => r.listed === undefined);
    listed = listed.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    notlisted = notlisted.sort((a, b) =>
      a.owned === b.owned ? 0 : a.owned === true ? -1 : 1
    );
    setMints(listed.concat(notlisted));
  }, []);

  useEffect(() => {
    asyncGetDropMints(drop.id);
  }, []);

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
