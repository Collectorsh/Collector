import Link from "next/link";
import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";

import ContentLoader from "react-content-loader";
import clsx from "clsx";
import CloudinaryImage from "../CloudinaryImage";
import { video } from "@cloudinary/url-gen/qualifiers/source";

export default function Nft({ user, token, onLoad, columns, onError }) {
  
  const [videoUrl, setVideoUrl] = useState();
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef();
  

  const responsiveSteps = () => {
    switch (columns) {
      case 2: return 1400;
      case 3: return 800;
      default: return 500;
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [videoUrl])

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
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  id={`video-${ token.mint }`}
                  className="mx-auto w-full h-full cursor-pointer object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
                  // onLoadedData={onImageLoad}
                  onCanPlay={e => e.target.classList.add("opacity-100")}
                  onError={(e) => e.target.classList.add("hidden")}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : null}
            
            <CloudinaryImage
              id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
              // className="mx-auto cursor-pointer object-center object-cover"
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
