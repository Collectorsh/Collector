import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";
import CloudinaryImage from "./CloudinaryImage";

export default function Image({ token, size = "small" }) {
  const [videoUrl, setVideoUrl] = useState();
  const [htmlUrl, setHtmlUrl] = useState();

  const iframeRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  useEffect(() => {
    if (!token.image) return;
    if (token.image.split(".").pop().includes("mp4")) {
      setVideoUrl(token.image);
    } else if (token.animation_url) {
      if (token.animation_url.split(".").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      } else if (token.animation_url.split(".").pop().includes("html")) {
        setHtmlUrl(token.animation_url);
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
  }, [token]);

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

  if (!isMounted.current) return null;

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
          <div className="relative">
            {/* {htmlUrl ? (
              <iframe
                ref={iframeRef}
                className={"absolute inset z-20 w-full h-full"}
                src={htmlUrl} title={token.name || token.mint}
              />
            ) : null} */}
            <CloudinaryImage
              // mint={token.mint}
              token={token}
              // id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
              width={1200}
              noLazyLoad
              quality="auto:best"
              useMetadataFallback
              useUploadFallback
            />
          </div>
      )}
    </>
  );
}
