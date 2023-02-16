import React, { useEffect } from "react";
import Card from "/components/gallery/Card";
import Masonry from "react-masonry-css";

export default function GalleryContainer({ tokens, user }) {
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const breakpointColumnsObj = {
    default: user.columns,
    1100: user.columns - 1,
    700: user.columns - 2,
  };

  return (
    <div className="clear-both w-full mt-6">
      <div className="clear-both">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={`masonry-grid ${user.columns === 3 && "-ml-16"} ${
            user.columns === 4 && "-ml-10"
          } ${user.columns === 5 && "-ml-8"}`}
          columnClassName={`masonry-grid_column ${
            user.columns === 3 && "pl-16"
          } ${user.columns === 4 && "pl-10"} ${user.columns === 5 && "pl-8"}`}
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
