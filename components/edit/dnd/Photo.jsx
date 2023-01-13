import React, { forwardRef, useEffect, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { nftByMintAddress } from "/queries/nft_by_mint";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const height = props.height ? props.height : 200;

    const [nftByMintAddressQl] = useLazyQuery(nftByMintAddress, {
      fetchPolicy: "network-only",
    });

    const fetchNft = useCallback(async (mint) => {
      const res = await nftByMintAddressQl({
        variables: { address: mint },
      });
      document.getElementById(`grid-${mint}`).src =
        res.data.nftByMintAddress.image;
    }, []);

    useEffect(() => {
      if (!mint) return;
      fetchNft(mint);
    }, []);

    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: height,
      width: "100%",
      gridRowStart: index === 0 ? "span 1" : null,
      gridColumnStart: index === 0 ? "span 1" : null,
      backgroundColor: "grey",
      ...style,
    };

    if (props.width) {
      inlineStyles.width = height;
    }

    return (
      <img
        id={`grid-${mint}`}
        className="w-full opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm"
        ref={ref}
        style={inlineStyles}
        {...props}
      />
    );
  }
);

Photo.displayName = "Photo";
