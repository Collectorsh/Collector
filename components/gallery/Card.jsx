import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import ExchangeOffers from "/components/gallery/ExchangeOffers";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import AcceptOffers from "/components/gallery/AcceptOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";
import EstimatedValue from "/components/gallery/EstimatedValue";

function Card(props) {
  const user = props.user;
  const isMounted = useRef(true);
  const [token, setToken] = useState();

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
    <div className="opacity-0 relative">
      {token && (
        <>
          <Nft user={user} token={token} />
          <ExchangeOffers token={token} />
          <Listings token={token} />
          <ShowOffers token={token} />
          <AcceptOffers token={token} />
          <MetaContainer user={user} token={token} />
          {user && user.estimated_value && <EstimatedValue token={token} />}
        </>
      )}
    </div>
  );
}

export default Card;
