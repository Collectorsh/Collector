import React, { useEffect, useState } from "react";
import Card from "/components/gallery/Card";
import Masonry from "react-masonry-css";
import LazyLoader from "../LazyLoader";
import clsx from "clsx";

export default function GalleryContainer({ tokens, user }) {
  const [lazyLoadIndex, setLazyLoadIndex] = useState(9);

  const renderedTokens = tokens?.slice(0, lazyLoadIndex)

  const handleLazyLoad = () => {
    setLazyLoadIndex(prev => prev + 9);
  }

  const columns = user && user.columns ? user.columns : 3;

  const breakpointColumnsObj = {
    default: columns,
    1100: columns - 1,
    700: columns - 2,
    400: 1
  };

  return (
    <div className="clear-both w-full mt-6">
      {!tokens && (
        // <h2 className="animate-pulse font-bold text-4xl text-center text-greeny mt-[25%]">Collector</h2>
        <h1 className="animate-pulse font-bold text-4xl text-center mt-[25%]">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
      )}
      <div className="clear-both">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={`masonry-grid ${columns === 2 && "-ml-24"} ${
            columns === 3 && "-ml-16"
          } ${columns === 4 && "-ml-10"} ${columns === 5 && "-ml-8"}`}
          columnClassName={`masonry-grid_column ${columns === 2 && "pl-24"} ${
            columns === 3 && "pl-16"
          } ${columns === 4 && "pl-10"} ${columns === 5 && "pl-8"}`}
        >
          {Array.isArray(renderedTokens) &&
            renderedTokens.map((token, index) => {
              if (token.visible)
                return <Card key={index} token={token} user={user} columns={columns} />;
            })}
        </Masonry>

        {/* <div className={clsx(
          "grid gap-4 items-center",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4",
          columns === 5 && "grid-cols-5",

        )}>
          {Array.isArray(renderedTokens) &&
            renderedTokens.map((token, index) => {
              if (token.visible)
                return <Card key={index} token={token} user={user} onLoad={handleLoad} />;
            })}
        </div> */}
      
        {lazyLoadIndex < tokens?.length ? <LazyLoader cb={handleLazyLoad} rootMargin="700px"/> : null}
      </div>
    </div>
  );
}
