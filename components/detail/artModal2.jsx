import { useEffect, useRef, useState } from "react";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import ContentLoader from "react-content-loader";
import VideoPlayer from "../artDisplay/videoPlayer";
import useNftFiles from "../../hooks/useNftFiles";
import HtmlViewer from "../artDisplay/htmlViewer";

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import("../artDisplay/modelDisplay"), {
  ssr: false
});


export default function ArtModal({ isOpen, onClose, token }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)

  const useAltMediaAspectRatio = htmlUrl || vrUrl



  if (!token) return null;
  
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      // widthClass={"max-w-fit"}
      widthClass=""
      closeButtonPlacement="absolute -right-3 -top-3"
     
    >
      <div className={clsx(
        "relative max-w-full rounded mx-auto overflow-hidden flex justify-center items-center",
        // useAltMediaAspectRatio
        //   ? "h-[calc(100svh-4rem)] h-[calc(100vh-4rem)] w-[calc(100svw-4rem)] w-[calc(100vw-4rem)]"
        //   : "w-fit"
        "h-[calc(100svh-4rem)] h-[calc(100vh-4rem)] w-[calc(100svw-4rem)] w-[calc(100vw-4rem)]"
      )}>        
        {/* {!imgLoaded && !useAltMediaAspectRatio ? (
          <ContentLoader
            speed={2}
            className="absolute inset-0 w-full h-full rounded"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-full" />
          </ContentLoader>
        ) : null} */}

        <CloudinaryImage
          className={clsx(
            "max-h-[calc(100svh-4rem)] max-h-[calc(100vh-4rem)]",
            videoLoaded && "hidden",
            // useAltMediaAspectRatio && "hidden"
            useAltMediaAspectRatio || videoUrl && "absolute inset-0 w-full h-full object-contain z-0"
          )}
          token={token}
          useUploadFallback
          onLoad={() => setImgLoaded(true)}
        />
     
        <div className={clsx(
          "w-fit h-fit max-w-full max-h-full",
          useAltMediaAspectRatio || videoUrl ? "relative" : "hidden"
        )}>
          {vrUrl ? (
            <ModelViewer
              vrUrl={vrUrl}
            />
          ) : null }

          {htmlUrl ? (
            <HtmlViewer
              htmlUrl={htmlUrl}
            />
          ) : null }
        

          {videoUrl ? (
            <VideoPlayer
              id={`video-player-${ token.mint }`}
              videoUrl={videoUrl}
              videoLoaded={videoLoaded}
              setVideoLoaded={setVideoLoaded}
              token={token}
              wrapperClass="w-full h-full z-20 rounded"
            />
          ) : null}
        </div>

      </div>
    </Modal>
  )
}
