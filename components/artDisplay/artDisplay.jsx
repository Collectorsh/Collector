import { useEffect, useState } from "react";
import CloudinaryImage from "../CloudinaryImage"
import VideoPlayer from "./videoPlayer"
import clsx from "clsx";
import useNftFiles from "../../hooks/useNftFiles";
import MainButton from "../MainButton";
import { CATEGORIES } from "../FileDrop";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import ArtModal from "../detail/artModal";

const ArtDisplay = ({
  token,
  width,
  height,
  cacheWidth,
  maxHeightClass = "max-h-[75vh]",
  setMediaType,
  onImageLoad,
  imageRef,
  wrapperClass = "relative",
  useExpand = false,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [expandOpen, setExpandOpen] = useState(false);

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
    <div className={wrapperClass}>
      {useExpand ? (
        <>
          <ArtModal isOpen={expandOpen} onClose={() => setExpandOpen(false)} token={token} />
          <button
            onClick={() => setExpandOpen(true)}
            className={clsx("absolute z-[15] right-5 top-5 p-0.5",
              "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
              "duration-300",
              "md:opacity-50 hover:opacity-100 group-hover:opacity-100",
              "hover:scale-110 active:scale-100",
            )}
          >
            <ArrowsExpandIcon className="w-7 h-7" />
          </button>
        </>
      ) : null}
      {/* {
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
      } */}
      {videoUrl ? (
        <VideoPlayer
          id={`video-player-${ token.mint }`}
          videoUrl={videoUrl}
          videoLoaded={videoLoaded}
          setVideoLoaded={setVideoLoaded}
          controlsClass="group-hover/controls:translate-y-2 group-active/controls:translate-y-0"
          wrapperClass={clsx(
            // "absolute inset-0",
            'w-fit h-full rounded-lg group/controls',
            maxHeightClass
          )}
          style={videoStyle}
        />
      ) : null}

      <CloudinaryImage
        imageRef={imageRef}
        useMetadataFallback
        token={token}
        style={imageStyle}
        className={clsx(
          "object-cover duration-300",
          maxHeightClass,
          videoUrl && "absolute inset-0 w-full h-full",
          videoLoaded && "invisible",//"hidden",
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

