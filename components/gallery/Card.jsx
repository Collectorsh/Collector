import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";

function Card(props) {
  const user = props.user;
  const isMounted = useRef(true);
  const [token, setToken] = useState();
  const [span, setSpan] = useState(1);

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

  return (
    <div
      className={`col-span-1 mb-8 sm:mb-0 sm:col-span-${props.token.span} relative text-center h-fit opacity-0`}
    >
      {token && (
        <>
          <Nft user={user} token={token} />
          <Listings token={token} />
          <ShowOffers token={token} />
          <MetaContainer user={user} token={token} />
        </>
      )}
    </div>
  );
}

export default Card;
