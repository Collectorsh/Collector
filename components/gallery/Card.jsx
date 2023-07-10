import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";

import clsx from "clsx";

function Card(props) {
  const user = props.user;
  const columns = props.columns;
  const [token, setToken] = useState();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const initGetData = useCallback(async (tok) => {
    // console.log("METADATA HIT")
    try {
      const res = await getMetadataFromUri(tok);
      if (res) setToken(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLoad = (e) => { 
    if (!loaded) {
      setLoaded(true)
      initGetData(props.token);
    }
  }

  const handleError = () => {
    setError(true)
  }

  return (
    <div
      className={clsx("col-span-1 mb-8 sm:mb-0",
        // `sm:col-span-${props.token.span}`,
        "relative text-center transition-opacity duration-300 opacity-0",
        "h-fit",
        loaded && "loaded",
        error && "hidden",
      )}
    >
      <Nft user={user} token={props.token} tokenMetadata={token} onLoad={handleLoad} onError={handleError} columns={columns} />
      {token && (
        <>
          <Listings token={token} />
          <ShowOffers token={token} />
          <MetaContainer user={user} token={token} />
        </>
      )}
    </div>
  );
}

export default Card;
