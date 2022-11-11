import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import AcceptOffers from "/components/gallery/AcceptOffers";
import Nft from "/components/gallery/esther/Nft";
import MetaContainer from "/components/gallery/esther/MetaContainer";
import EstimatedValue from "/components/gallery/esther/EstimatedValue";

function Card({ user, token, size }) {
  const isMounted = useRef(true);
  const [finalToken, setFinalToken] = useState();

  const initGetData = useCallback(async (tok) => {
    try {
      const res = await getMetadataFromUri(tok);
      if (res && isMounted.current === true) setFinalToken(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    initGetData(token);
    return () => {
      isMounted.current = false;
    };
  }, [token, initGetData]);

  return (
    <div
      className={`opacity-0 relative ${
        user && user.rounded && "rounded-b-2xl"
      }`}
    >
      {finalToken && (
        <>
          <Nft user={user} token={finalToken} size={size} />
          <Listings token={finalToken} />
          <ShowOffers token={finalToken} />
          <AcceptOffers token={finalToken} />
          <div
            className={`z-50 absolute bottom-0 left-0 w-full px-3 py-1 backdrop-opacity-95 backdrop-blur-3xl h-12 dark:text-white ${
              user && user.rounded && "rounded-b-2xl"
            }`}
          >
            <MetaContainer user={user} token={finalToken} />
            {user && user.estimated_value && (
              <EstimatedValue token={finalToken} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
