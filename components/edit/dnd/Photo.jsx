import React, { forwardRef, useState, useEffect } from "react";
import { cdnImage } from "/utils/cdnImage";
import axios from "axios";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const [url, setUrl] = useState();

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

    useEffect(() => {
      urlFromMint(mint, uri).then((res) => {
        setUrl(res);
      });
    }, []);

    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: 200,
      gridRowStart: index === 0 ? "span 1" : null,
      gridColumnStart: index === 0 ? "span 1" : null,
      backgroundImage: `url("${url}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "grey",
      ...style,
    };

    return <div ref={ref} style={inlineStyles} {...props} />;
  }
);
