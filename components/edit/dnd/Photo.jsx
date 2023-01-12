import React, { forwardRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import axios from "axios";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const height = props.height ? props.height : 200;
    const urlFromMint = async (mint, uri) => {
      var image = cdnImage(mint);
      try {
        let res = await fetch(image, { method: "HEAD" });
        if (res.ok) {
          return image;
        }
      } catch (err) {
        try {
          let res = await axios.get(uri);
          return res.data.image;
        } catch (err) {
          console.log(err);
        }
      }
    };

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

    const addDefaultSource = (e, mint, uri) => {
      urlFromMint(mint, uri).then((res) => {
        if (res) e.target.src = res;
      });
    };

    return (
      <img
        className="w-full opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm"
        ref={ref}
        style={inlineStyles}
        {...props}
        // src={cdnImage(mint)}
        // onError={(e) => addDefaultSource(e, mint, uri)}
      />
    );
  }
);

Photo.displayName = "Photo";
