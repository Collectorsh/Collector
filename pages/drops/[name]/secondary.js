import { useState, useCallback, useEffect } from "react";
import getDropMints from "/data/drops/getDropMints";
import Items from "./items";
import { Oval } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Secondary({ drop }) {
  const [mints, setMints] = useState();
  const [infiniteScrollItems, setInfiniteScrollItems] = useState([]);

  // Get the drop mints
  const asyncGetDropMints = useCallback(async (id) => {
    let res = await getDropMints(id);
    const listed = res.filter((r) => r.listed === true);
    const notlisted = res.filter((r) => r.listed === undefined);
    const resp = listed
      .sort((a, b) => (a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0))
      .concat(notlisted);
    setMints(resp);
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
