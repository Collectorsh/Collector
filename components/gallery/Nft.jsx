import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

import CloudinaryImage from "../CloudinaryImage";

import useElementObserver from "../../hooks/useElementObserver";
import { video } from "@cloudinary/url-gen/qualifiers/source";

export default function Nft({ user, token, onLoad, columns, onError }) {
  
  const [videoUrl, setVideoUrl] = useState();
  const [loaded, setLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const { isVisible } = useElementObserver(videoRef, "500px")  

  const responsiveSteps = () => {
    switch (columns) {
      case 2: return 1400;
      case 3: return 800;
      default: return 500;
    }
  }

  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible && videoLoaded) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }

  },[isVisible, videoLoaded])

  useEffect(() => {
    if (!token) return;
    try {
      if (token.animation_url) {
        if (token.animation_url.split(".").pop().includes("mp4")) {
          setVideoUrl(token.animation_url);
        }
      } else {
        for (let file of token.properties.files) {
          if (file.type && file.type === "video/mp4") {
            setVideoUrl(file.uri);
          }
        }
      }
    } catch (err) {
      // expected to have some errors
    }
  }, [token]);

  const onImageLoad = (event) => {
    setLoaded(true);
    onLoad(event)
  };

  return (
    <>
      <div
        className={`overflow-hidden border-dark3 relative ${
          user && user.shadow && "shadow-lg"
        } ${user && user.border && "border-8"} ${
          user && user.rounded && "rounded-2xl"
          }`}
      >
        <Link href={`/nft/${ token.mint }`} title="">
          <a className={loaded ? "animate-enter" : "opacity-0"}>
            {videoUrl && loaded ? (
              <>
                <video
                  autoPlay
                  ref={videoRef}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  id={`video-${ token.mint }`}
                  className="mx-auto w-full h-full cursor-pointer object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
                  // onCanPlay onLoadedData
                  onCanPlayThrough={e => {
                    e.target.classList.add("opacity-100")
                    setVideoLoaded(true)
                  }}
                  onError={(e) => e.target.classList.add("hidden")}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : null}
     
            <CloudinaryImage
              id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
              className={videoLoaded ? "invisible" : undefined}
              mint={token.mint}
              onLoad={onImageLoad}
              width={responsiveSteps()}
              metadata={token}
              onError={onError}
            />            
          </a>
        </Link>        
      </div>
    </>
  );
}
