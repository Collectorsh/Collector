import { useEffect, useRef, useState } from "react";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import ContentLoader from "react-content-loader";
import VideoPlayer from "../artDisplay/videoPlayer";
import useNftFiles from "../../hooks/useNftFiles";
import HtmlViewer from "../artDisplay/htmlViewer";

export default function ArtModal({ isOpen, onClose, token }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const { videoUrl, htmlUrl } = useNftFiles(token)

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

        {htmlUrl ? (
          <HtmlViewer
            htmlUrl={htmlUrl}
          />
        ) :null }

        {videoUrl ? (
          <VideoPlayer
            id={`video-player-${ token.mint }`}
            videoUrl={videoUrl}
            videoLoaded={videoLoaded}
            setVideoLoaded={setVideoLoaded}
          />
        ) : null}

        <CloudinaryImage
          className={clsx("max-h-[calc(100svh-5rem)] max-h-[calc(100vh-5rem)]", videoLoaded && "invisible")}
          token={token}
          useUploadFallback
          onLoad={() => setImgLoaded(true)}
        />
      </div>
    </Modal>
  )
}
