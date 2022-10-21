import React, { useState, useEffect, useCallback } from "react";
import getFeed from "/data/home/getFeed";
import Details from "/components/home/feed/Details";
import Masonry from "react-masonry-css";
import { Oval } from "react-loader-spinner";

export default function Activity() {
  const [activity, setActivity] = useState();

  const fetchFeed = useCallback(async () => {
    let res = await getFeed();
    console.log(res.data);
    setActivity(res.data);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div>
      {!activity && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {activity && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {activity.map((item, index) => (
            <div key={index}>
              <Details item={item} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
