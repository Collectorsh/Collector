import { useRef, useState } from "react"
import useNftFiles from "../../hooks/useNftFiles"
import CloudinaryImage, { IMAGE_FALLBACK_STAGES } from "../CloudinaryImage"
import { truncate } from "../../utils/truncate"
import clsx from "clsx"

const AddTokenButton = ({
  token,
  alreadyInUse,
  artistUsername,
  moduleFull,
  setNewArtModule,
  handleTokenToSubmit,
  curationType
}) => {

  const imageRef = useRef(null)
  const { videoUrl } = useNftFiles(token)
  const [loadingAspectRatio, setLoadingAspectRatio] = useState(false)
  const [error, setError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAdd = async () => {
    if (alreadyInUse || moduleFull) return
    const newToken = { ...token }

    if (curationType !== "curator") {//"artist" || "collector" 
      // needs to add aspect ratio to token for when it gets auto submitted
      setLoadingAspectRatio(true)
      const aspectRatio = await getAspectRatio(imageRef.current)
      setLoadingAspectRatio(false)

      if (!aspectRatio) return console.log("Error getting aspect ratio")

      newToken.aspect_ratio = aspectRatio

      if (newToken.editions?.length) {
        newToken.editions = newToken.editions.map(edition => ({
          ...edition,
          aspect_ratio: aspectRatio
        }))
      }

      handleTokenToSubmit(newToken)
    }

    setNewArtModule(prev => ({
      ...prev,
      tokens: [...(prev?.tokens || []), token.mint]
    }))
  }

  const getAspectRatio = async (imageElement) => {
    try {
      if (videoUrl) {
        //fetch video dimensions
        const video = document.createElement("video")

        return new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve(Number(video.videoWidth / video.videoHeight))
          video.onerror = (err) => reject(new Error(`Unable to load video - ${ err }`));
          video.src = videoUrl
          video.load()
        });
      }
    } catch (err) {
      console.log("Error fetching non-image dimensions: ", err)
    }

    return Number(imageElement.naturalWidth / imageElement.naturalHeight)
  }
  const handleError = (e) => {
    if (e === IMAGE_FALLBACK_STAGES.METADATA) {
      setError(true)
    }
  }

  const editionCount = token.editions?.length
  return (
    <button className={clsx(
      "relative flex justify-center flex-shrink-0 rounded-lg overflow-hidden",
      "duration-300 hover:scale-[102%] disabled:scale-100",
      "inset-0 w-full pb-[100%]",
      error && "hidden"
    )}
      key={token.mint}
      onClick={handleAdd}
      disabled={alreadyInUse || moduleFull || loadingAspectRatio || !imageLoaded}
    >
      <div className={clsx(
        !editionCount && "hidden",
        "bg-white dark:bg-neutral-900",
        "rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700",
        "min-w-fit w-5 h-5 absolute top-2 right-2 z-10 flex justify-center items-center",
        "text-leading-none font-bold"
      )}>
        {editionCount}
      </div>
      <CloudinaryImage
        imageRef={imageRef}
        className={clsx("flex-shrink-0 object-contain shadow-lg dark:shadow-white/5",
          "w-full h-full absolute left-0 top-0",
        )}
        useMetadataFallback
        token={token}
        width={500}
        onError={handleError}
        onLoad={() => setImageLoaded(true)}
      // noLazyLoad
      />

      {error ? (
        <div
          className="absolute text-center inset-0 p-8 w-full h-full overflow-hidden bg-neutral-200/90 dark:bg-neutral-800/90  
             flex flex-col justify-center items-center rounded-lg z-[15]
          "
        >
          <p>Error loading metadata image</p>
        </div>
      ) : null}

      {alreadyInUse ? (
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <p className=" bg-neutral-200 dark:bg-neutral-800 px-2 rounded-md">Already Being Used</p>
        </div>
      ) : null}
      <div
        className="absolute text-center inset-0 p-8 w-full h-full overflow-hidden bg-neutral-200/90 dark:bg-neutral-800/90 
            transition-opacity duration-300 opacity-0 hover:opacity-100
             flex flex-col justify-center items-center rounded-lg z-20
          "
      >
        <p className="font-bold">{token.name}</p>
        {artistUsername ? <p>by {artistUsername}</p> : null}
        <p className="text-xs">{truncate(token.mint)}</p>
      </div>
    </button>
  )
}

export default AddTokenButton