import { useRef, useState } from "react";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import VideoPlayer from "../artDisplay/videoPlayer";
import useNftFiles, { altFileAspectRatio } from "../../hooks/useNftFiles";
import HtmlViewer from "../artDisplay/htmlViewer";

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import("../artDisplay/modelDisplay"), {
  ssr: false
});


export default function ArtModal({ isOpen, onClose, token,  }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)

  const useAltMediaAspectRatio = htmlUrl || vrUrl
  
  if (!token) return null;
  
  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      widthClass="w-[auto_!important]"
      closeButtonPlacement="absolute -right-3 -top-3"
      padding="p-2"
    >
      <div
        ref={wrapperRef}
        className={clsx(
        "relative rounded mx-auto overflow-hidden",
        useAltMediaAspectRatio
          ? "h-[calc(100svh-4rem)] h-[calc(100vh-4rem)] w-[calc(100svw-4rem)] w-[calc(100vw-4rem)]"
          : "w-fit h-fit max-h-full"
        // "h-[calc(100svh-4rem)] h-[calc(100vh-4rem)] w-[calc(100svw-4rem)] w-[calc(100vw-4rem)] max-w-fit max-h-fit"
      )}>        
        <CloudinaryImage
          imageRef={imageRef}
          className={clsx("w-full h-full object-contain",
            "max-h-[calc(100svh-4rem)] max-h-[calc(100vh-4rem)]",
            videoLoaded && "hidden",
            (useAltMediaAspectRatio || videoUrl) && "absolute inset-0 object-contain z-0"
          )}
          token={token}
          useUploadFallback
          useMetadataFallback
        />

          {(vrUrl) ? (
            <ModelViewer
              vrUrl={vrUrl}
            />
          ) : null}

          {(htmlUrl) ? (
            <HtmlViewer
              htmlUrl={htmlUrl}
            />
          ) : null}

          {(videoUrl) ? (
            <VideoPlayer
              id={`video-player-${ token.mint }`}
              videoUrl={videoUrl}
              videoLoaded={videoLoaded}
              setVideoLoaded={setVideoLoaded}
              token={token}
              wrapperClass={clsx(
                "w-auto h-full duration-100 z-20",
                "max-h-[calc(100svh-4rem)] max-h-[calc(100vh-4rem)]"
              )}
              style={{
                width: "100%",
                maxHeight: "calc(100vh - 4rem)"
              }}
            />
          ) : null}

      </div>
    </Modal>
  )
}
