import React, { useState, useEffect, useCallback } from "react";
import ArtistPageHeader from "/components/artist/ArtistPageHeader";
import Nft from "./Nft";
import getListingsFromMints from "/data/listings/getListingsFromMints";

function ArtistPage({ profileUser, mints }) {
  const [stats, setStats] = useState();
  const [tokens, setTokens] = useState();

  const asyncGetListings = useCallback(async (mints) => {
    let res = await getListingsFromMints(mints.mints.map((m) => m.mint));
    for (const mint of mints.mints) {
      let l = res.data.filter((r) => r.mint === mint.mint);
      if (l[0]) {
        mint.listed = true;
        mint.source = l[0].source;
        mint.amount = l[0].amount;
      }
    }
    setTokens(mints);
  }, []);

  useEffect(() => {
    if (!mints) return;
    const total = mints.mints.length - mints.collections.length;
    setStats({
      items: total,
      collections: mints.collections.length,
      listings: mints.listings,
    });
    asyncGetListings(mints);
  }, [mints]);

  return (
    <div>
      <ArtistPageHeader
        tokens={tokens && tokens.mints}
        user={profileUser}
        stats={stats}
      />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 pb-12">
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
          {tokens &&
            tokens.mints
              .filter(
                (m) =>
                  m.collection === null &&
                  !tokens.collections.map((m) => m.address).includes(m.address)
              )
              .map((item) => <Nft token={item} />)}
        </div>
        {tokens &&
          tokens.collections.map((collection, index) => (
            <div
              key={index}
              className="my-12 py-6 border-t border-neutral-100 dark:border-neitral-900"
            >
              <h1 className="pb-6 text-3xl">{collection.name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
                {tokens.mints
                  .filter((m) => m.collection === collection.address)
                  .map((item) => (
                    <Nft token={item} />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ArtistPage;
