import { useEffect, useRef, useState } from "react";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import ContentLoader from "react-content-loader";

export default function ArtModal({ isOpen, onClose, token }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);



  useEffect(() => {
    if (!videoRef.current) return;
    if (videoLoaded) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }

  }, [videoLoaded])

  useEffect(() => {
    if (!token) return;

    if (token.animation_url) {
      if (token.animation_url.split(".").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      }
    }
  }, [token]);

  if (!token) return null
  
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      widthClass="max-w-fit"
      closeButtonPlacement="absolute -right-3 -top-3"
    >
      <div className="relative w-fit max-w-full rounded mx-auto overflow-hidden">
        {!imgLoaded ? (
          <ContentLoader
            speed={2}
            className="w-full h-full rounded"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-full" />
          </ContentLoader>
        ) : null}

        {videoUrl && imgLoaded ? (
          <>
            <video
              autoPlay
              ref={videoRef}
              preload="metadata"
              muted
              loop
              playsInline
              id={`video-${ token.mint }`}
              className="w-full h-full cursor-pointer object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
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
          className="max-h-[calc(100svh-5rem)] max-h-[calc(100vh-5rem)]"
          token={token}
          useUploadFallback
          onLoad={() => setImgLoaded(true)}
        />
      </div>
    </Modal>
  )
}
