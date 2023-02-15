import React, { forwardRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import imageExists from "image-exists";
import axios from "axios";
import apiClient from "/data/client/apiClient";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const height = props.height ? props.height : 200;

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

    const addDefaultSource = async (e, mint, url) => {
      const res = await axios.get(url);
      const image = res.data.image;
      imageExists(image, function (exists) {
        if (exists) {
          console.log(image);
          e.target.src = image;
          try {
            let images = [{ uri: image, mint: mint }];
            apiClient.post("/images/upload", {
              images: images,
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    };

    return (
      <img
        className="w-full opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm"
        src={cdnImage(mint)}
        onError={(e) => addDefaultSource(e, mint, uri)}
        ref={ref}
        style={inlineStyles}
        {...props}
      />
    );
  }
);

Photo.displayName = "Photo";
