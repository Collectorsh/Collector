import Script from "next/script";
import React, { useState, useEffect } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";

export default function Image({ token, size = "small" }) {
  const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    if (!token.image) return;
    if (token.image.split(".").pop().includes("mp4")) {
      setVideoUrl(token.image);
    }
  }, [token.image]);

  const onImageLoad = (event) => {
    event.target.classList.add("loaded");
  };

  function style() {
    let styles;
    if (size === "small") {
      styles =
        "h-80 w-80 opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm";
    } else if (size === "large") {
      styles = "shadow-lg object-center object-cover";
    }
    return styles;
  }

  return (
    <>
      {videoUrl ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            id="video"
            className={style()}
            onLoadedData={onImageLoad}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Script
            id="autoplay-script"
            dangerouslySetInnerHTML={{
              __html: `document.getElementById("video").play()`,
            }}
          />
        </>
      ) : (
        <img
          src={cdnImage(token.mint)}
          onLoad={onImageLoad}
          className={style()}
          onError={(e) => addDefaultSource(e, token.mint, token.image)}
        />
      )}
    </>
  );
}
