import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";
import useElementObserver from "../../hooks/useElementObserver";

function Card(props) {
  const user = props.user;
  const onLoad = props.onLoad;
  const isMounted = useRef(true);
  const [token, setToken] = useState();
  const [loaded, setLoaded] = useState(false);

  const initGetData = useCallback(async (tok) => {
    try {
      const res = await getMetadataFromUri(tok);
      if (res && isMounted.current === true) setToken(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    initGetData(props.token);
    return () => {
      isMounted.current = false;
    };
  }, [props.token, initGetData]);

  const handleLoad = () => { 
    onLoad()
    setLoaded(true)
  }

  return (
    <div
      className={`col-span-1 mb-8 sm:mb-0 sm:col-span-${props.token.span} relative text-center h-fit transition-opacity duration-300 opacity-0 ${loaded && "loaded"}`}
    >
      {token && (
        <>
          <Nft user={user} token={token} onLoad={handleLoad} />
          {/* <Listings token={token} /> */}
          <ShowOffers token={token} />
          <MetaContainer user={user} token={token} />
        </>
      )}
    </div>
  );
}

export default Card;
