import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import getNewArtistAuctions from "/data/home/getNewArtistAuctions";
import GridView from "/components/GridView";
import { Oval } from "react-loader-spinner";

export default function NewArtists() {
  const [auctions, setAuctions] = useState([]);
  const [infiniteScrollItems, setInfiniteScrollItems] = useState();

  const fetchAuctions = useCallback(async () => {
    let res = await getNewArtistAuctions();
    console.log(res);
    setAuctions(res.data);
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (auctions.length === 0) {
      return;
    }
    setInfiniteScrollItems(auctions.slice(0, 25));
  }, [auctions]);

  function fetchData() {
    setInfiniteScrollItems((currentDisplayedItems) =>
      auctions.slice(0, currentDisplayedItems.length + 25)
    );
  }

  return (
    <div className="mb-12">
      {auctions.length === 0 && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {auctions.length > 0 && (
        <>
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit py-5 inline-block dark:text-white">
            New Artists
          </h2>
          {infiniteScrollItems && (
            <InfiniteScroll
              dataLength={infiniteScrollItems.length}
              next={fetchData}
              hasMore={infiniteScrollItems.length !== auctions.length}
            >
              <GridView items={infiniteScrollItems} type="auction" />
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
}
