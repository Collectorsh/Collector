import { useState } from "react";
import CloudinaryImage from "../CloudinaryImage"
import VideoPlayer from "./videoPlayer"
import useNftFiles from "./useNftFiles";
import clsx from "clsx";

const ArtDisplay = ({ token, width, height, cacheWidth }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { videoUrl, htmlUrl } = useNftFiles(token)

  const useDimensions = width !== undefined && height !== undefined

  const videoStyle = useDimensions ? {
    height: height,
    maxWidth: width,
    maxHeight: "75vh"
  } : {}
  const imageStyle = useDimensions ? {
    height: height,
    maxWidth: width,
  } : {}

  return (
    <div className="relative">
      {htmlUrl ? (
        <iframe
          onLoad={() => setVideoLoaded(true)}
          src={htmlUrl}
          className={clsx(
            "w-full h-full",
            "rounded-lg group/controls"
          )}
          style={videoStyle}
        />
      ) : null}

      {videoUrl ? (
        <VideoPlayer
          id={`video-player-${ token.mint }`}
          videoUrl={videoUrl}
          videoLoaded={videoLoaded}
          setVideoLoaded={setVideoLoaded}
          controlsClass="group-hover/controls:translate-y-2 group-active/controls:translate-y-0"
          wrapperClass='w-full h-full rounded-lg group/controls'
          style={videoStyle}
        />
      ) : null}

      <CloudinaryImage
        useMetadataFallback
        token={token}
        style={imageStyle}
        className={clsx(
          "object-cover duration-300",
          "max-h-[75vh]",
          videoUrl && "absolute inset-0 w-full h-full",
          videoLoaded && "hidden"
        )}
        width={cacheWidth}
        noLazyLoad
      />

    </div>
  )
}

export default ArtDisplay