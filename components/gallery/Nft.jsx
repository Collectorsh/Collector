import Link from "next/link";
import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";

import ContentLoader from "react-content-loader";
import clsx from "clsx";
import CloudinaryImage from "../CloudinaryImage";

export default function Nft({ user, token, onLoad, tokenMetadata, columns }) {
  const [videoUrl, setVideoUrl] = useState();
  const [loaded, setLoaded] = useState(false);

  const responsiveSteps = () => {
    switch (columns) {
      case 2: return 2000;
      case 3: return 1000;
      default: return 600;
    }
  }

  useEffect(() => {
    if (!tokenMetadata) return;
    try {
      if (tokenMetadata.animation_url) {
        if (tokenMetadata.animation_url.split(".").pop().includes("mp4")) {
          setVideoUrl(tokenMetadata.animation_url);
        }
      } else {
        for (let file of tokenMetadata.properties.files) {
          if (file.type && file.type === "video/mp4") {
            setVideoUrl(file.uri);
          }
        }
      }
    } catch (err) {
      // expected to have some errors
    }
  }, [tokenMetadata]);

  const onImageLoad = (event) => {
    setLoaded(true);
    onLoad()
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
        {/* <div className={clsx("md:p-4 top-0 left-0 w-full", loaded ? "hidden" : "absolute")}>
          <ContentLoader
            speed={2}
            className="w-full mb-4 h-[250px] rounded-lg"
             backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-full" />
          </ContentLoader>
        </div> */}

        <Link href={`/nft/${ token.mint }`} title="">
          <a className={loaded ? "animate-enter" : "opacity-0"}>
            {videoUrl ? (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  id="video"
                  className="mx-auto w-100 h-100 cursor-pointer object-center object-cover"
                  // onLoadedData={onImageLoad}
                  onCanPlay={onImageLoad}
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
                  id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ token.mint }`}
                  // className="mx-auto cursor-pointer object-center object-cover"
                  mint={token.mint}
                  onLoad={onImageLoad}
                  noLazyLoad
                  quality="auto:best"
                  width={responsiveSteps()}
                  metadata={tokenMetadata}
              />
            )}
          </a>
        </Link>        
      </div>
    </>
  );
}
