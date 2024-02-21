import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

function Exchange(props) {
  return; //DEPRECATED - TO BE DELETED

  const [collection, setCollection] = useState();

  useEffect(() => {
    let isMounted = true;
    axios
      .get(
        "https://api.exchange.art/v1/public/tokens/metadata?mints=" +
          props.mint,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (!res.data[props.mint]) return;
        if (res.data[props.mint].collectionName !== undefined && isMounted) {
          setCollection(res.data[props.mint]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [props.mint]);

  return (
    <div className="mb-0">
      {collection && (
        <div className="mt-8">
          <Link
            href={`https://exchange.art/single/${props.mint}`}
            title={collection.brandName}
          >
            <a className="bg-exchange w-fit px-3 py-3 rounded-lg align-middle cursor-pointer text-slate-900 font-semibold">
              <span className="align-top">Make an Offer</span>
              {/* <ExternalLinkIcon className="inline h-4 w-4 align-middle ml-1 -mt-1" /> */}
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Exchange;
