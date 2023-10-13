import { useEffect, useState } from "react";
import CloudinaryImage from "../CloudinaryImage"
import VideoPlayer from "./videoPlayer"
import clsx from "clsx";
import useNftFiles from "../../hooks/useNftFiles";
import MainButton from "../MainButton";
import { CATEGORIES } from "../FileDrop";

const ArtDisplay = ({ token, width, height, cacheWidth, setMediaType, onImageLoad }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [htmlLoaded, setHtmlLoaded] = useState(false);

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

  useEffect(() => {
    if (!setMediaType) return
    if (htmlUrl) setMediaType(CATEGORIES.HTML)
    else if (videoUrl) setMediaType(CATEGORIES.VIDEO)
    else setMediaType(CATEGORIES.IMAGE)
  }, [videoUrl, htmlUrl, setMediaType])


  return (
    <div className="relative">
      {
        htmlUrl ? (
          <div className="w-full h-full absolute inset-0">
            <iframe
              onLoad={() => setHtmlLoaded(true)}
              src={htmlUrl}
              className={clsx(
                "w-full h-full",
                "rounded-lg"
              )}
              style={videoStyle}
            />
            </div>
        ) : null
      }
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
          videoLoaded && "hidden",
          htmlLoaded && "invisible"
        )}
        width={cacheWidth}
        noLazyLoad
        onLoad={onImageLoad}
      />

    </div>
  )
}

export default ArtDisplay

