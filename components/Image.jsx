import Script from "next/script";
import React, { useState, useEffect } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";
import CloudinaryImage from "./CloudinaryImage";

export default function Image({ token, size = "small" }) {
  const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    if (!token.image) return;
    if (token.image.split(".").pop().includes("mp4")) {
      setVideoUrl(token.image);
    } else if (token.animation_url) {
      if (token.animation_url.split(".").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      }
    } else {
      try {
        if (token.properties) {
          let file = token.properties.files[0];
          if (file && file.type === "video/mp4") {
            setVideoUrl(file.uri);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [token.image]);

  const onImageLoad = (event) => {
    event.target.classList.add("loaded");
  };

  function style() {
    let styles;
    if (size === "small") {
      styles =
        "w-[600px] h-[400px] md:w-[500px] md:h-[300px] opacity-0 cursor-pointer hover:origin-center object-center object-cover";
    } else if (size === "medium") {
      styles = "md:w-[550px]";
    } else if (size === "large") {
      styles = "object-center object-cover";
    } else if (size === "max") {
      styles = "max-h-full max-w-full mx-auto object-center object-cover";
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
            controls
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
          <CloudinaryImage
            mint={token.mint}
            id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
            width={1200}
            noLazyLoad
          />
        // <img
        //   src={cdnImage(token.mint)}
        //   onLoad={onImageLoad}
        //   className={style()}
        //   onError={(e) => addDefaultSource(e, token.mint, token.image)}
        // />
      )}
    </>
  );
}
