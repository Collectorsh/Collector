import Link from "next/link";
import Script from "next/script";
import React, { useState, useEffect } from "react";
import { cdnImage } from "/utils/cdnImage";
import { addDefaultSource } from "/utils/addDefaultSource";

export default function Nft({ user, token }) {
  const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    if (!token) return;
    try {
      for (let file of token.properties.files) {
        if (file.type && file.type === "video/mp4") {
          setVideoUrl(file.uri);
        }
      }
    } catch (err) {
      // expected to have some errors
    }
  }, [token]);

  const onImageLoad = (event) => {
    event.target.parentNode.parentNode.parentNode.classList.add("loaded");
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
        <Link href={`/nft/${token.mint}`} title="">
          <a>
            {videoUrl ? (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  id="video"
                  className="w-100 h-100 cursor-pointer object-center object-cover"
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
                className="cursor-pointer object-center object-cover"
                onError={(e) => addDefaultSource(e, token.mint, token.image)}
              />
            )}
          </a>
        </Link>
      </div>
    </>
  );
}
