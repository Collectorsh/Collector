import React, { useEffect } from "react";
import Card from "/components/gallery/Card";
import Masonry from "react-masonry-css";

export default function GalleryContainer({ tokens, user }) {
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const columns = user && user.columns ? user.columns : 3;

  const breakpointColumnsObj = {
    default: columns,
    1100: columns - 1,
    700: columns - 2,
  };

  return (
    <div className="clear-both w-full mt-6">
      <div className="clear-both">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={`masonry-grid ${columns === 2 && "-ml-20"} ${
            columns === 3 && "-ml-16"
          } ${columns === 4 && "-ml-10"} ${columns === 5 && "-ml-8"}`}
          columnClassName={`masonry-grid_column ${columns === 2 && "pl-20"} ${
            columns === 3 && "pl-16"
          } ${columns === 4 && "pl-10"} ${columns === 5 && "pl-8"}`}
        >
          {Array.isArray(tokens) &&
            tokens.map((token, index) => {
              if (token.visible)
                return <Card key={index} token={token} user={user} />;
            })}
        </Masonry>
      </div>
    </div>
  );
}
