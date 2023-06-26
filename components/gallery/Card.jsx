import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";
import useElementObserver from "../../hooks/useElementObserver";

function Card(props) {
  const user = props.user;
  const columns = props.columns;
  const [token, setToken] = useState();
  const [loaded, setLoaded] = useState(false);

  const initGetData = useCallback(async (tok) => {
    // console.log("METADATA HIT")
    try {
      const res = await getMetadataFromUri(tok);
      if (res) setToken(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLoad = () => { 
    setLoaded(true)
    initGetData(props.token);
  }

  return (
    <div
      className={`col-span-1 mb-8 sm:mb-0 sm:col-span-${props.token.span} relative text-center h-fit transition-opacity duration-300 opacity-0 ${loaded && "loaded"}`}
    >
      <Nft user={user} token={props.token} tokenMetadata={token} onLoad={handleLoad} columns={columns} />
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
