import React, { useEffect } from "react";
import Card from "/components/gallery/Card";

export default function GalleryContainer({ tokens, user }) {
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const columns = user && user.columns ? user.columns : 3;

  return (
    <div className="clear-both w-full mt-6">
      <div className="clear-both">
        <div
          className={`sm:grid grid-cols-${columns} gap-x-0 gap-y-8 sm:gap-8 md:gap-12 lg:gap-16 items-center pb-12`}
        >
          {Array.isArray(tokens) &&
            tokens.map((token, index) => {
              if (token.visible)
                return <Card key={index} token={token} user={user} />;
            })}
        </div>
      </div>
    </div>
  );
}
