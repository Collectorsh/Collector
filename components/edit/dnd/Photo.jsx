import React, { forwardRef, useEffect } from "react";
import { urlFromMint } from "/utils/urlFromMint";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const height = props.height ? props.height : 200;

    useEffect(() => {
      if (!mint || !uri) return;
      urlFromMint(mint, uri).then((res) => {
        document.getElementById(mint).src = res;
      });
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
        id={mint}
        className="w-full opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm"
        ref={ref}
        style={inlineStyles}
        {...props}
      />
    );
  }
);

Photo.displayName = "Photo";
