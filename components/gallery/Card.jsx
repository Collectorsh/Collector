import React, { useState, useEffect, useCallback, useRef } from "react";
import getMetadataFromUri from "/data/nft/getMetadataFromUri";
import Listings from "/components/gallery/Listings";
import ShowOffers from "/components/gallery/ShowOffers";
import Nft from "/components/gallery/Nft";
import MetaContainer from "/components/gallery/MetaContainer";
import { useImageSize } from "react-image-size";

function Card(props) {
  const image = props.token.image;
  const user = props.user;
  const isMounted = useRef(true);
  const [token, setToken] = useState();
  const [span, setSpan] = useState(1);

  const [dimensions, { loading, error }] = useImageSize(image);

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

  useEffect(() => {
    if (!dimensions) return;
    if (dimensions.width / dimensions.height > 1.25) {
      setSpan(2);
    }
  }, [dimensions]);

  return (
    <div className={`col-span-${span} relative text-center h-fit`}>
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
