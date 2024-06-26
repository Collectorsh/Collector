import { useEffect, useMemo, useRef, useState } from "react"
import useNftFiles from "../../hooks/useNftFiles"
import CloudinaryImage, { IMAGE_FALLBACK_STAGES } from "../CloudinaryImage"
import { truncate } from "../../utils/truncate"
import clsx from "clsx"
import { Oval } from "react-loader-spinner"
import { error } from "../../utils/toast";
import { Metaplex } from "@metaplex-foundation/js"
import { getMasterEditionSupply } from "../../utils/solanaWeb3/getMasterEditionSupply"
import { connection } from "../../config/settings"
import useElementObserver from "../../hooks/useElementObserver"

const AddTokenButton = ({
  token,
  alreadyInUse,
  artistUsername,
  moduleFull,
  setNewArtModule,
  handleTokenToSubmit,
  curationType,
  mintsInUse
}) => {

  const imageRef = useRef(null)
  const { videoUrl } = useNftFiles(token)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [adding, setAdding] = useState(false)

  const itemRef = useRef(null)

  const { isVisible } = useElementObserver(itemRef, "500px")
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeId = setTimeout(() => { 
      setShow(isVisible)
    }, 4)
    return () => clearTimeout(timeId)
  }, [isVisible])

  const availableEditions = useMemo(() => { 
    if (token.is_edition) return token.editions?.filter(edition => !mintsInUse.includes(edition.mint))
    if (token.compressed) return token.cNFTs?.filter(cNFT => !mintsInUse.includes(cNFT.mint))
    return null
  }, [mintsInUse, token])

  const alreadyUsed = (token.is_edition || token.compressed) ? !availableEditions?.length : alreadyInUse
  const disableAdd = alreadyUsed || moduleFull || !imageLoaded || adding

  const isMasterEdition = token.is_master_edition

  const handleAdd = async () => {
    if (alreadyUsed || moduleFull || adding) return;

    if (imageError) {
      error("Error loading image")
      return
    }

    let newToken;
    if (token.is_edition || token.compressed) {
      newToken = availableEditions[0]
      if (!newToken) {
        error("No available editions")
        return
      }
    } else {
      newToken = { ...token }
    }


    setAdding(true)

    if (curationType !== "curator") {//"artist" || "collector" 
      // needs to add aspect ratio to token for when it gets auto submitted

      const aspectRatio = await getAspectRatio(imageRef.current)
  
      if (!aspectRatio) {
        error(`Unable to process ${ videoUrl ? "video" : "image" }`)
        setAdding(false)
        console.log("Error getting aspect ratio")
        return
      }
      newToken.aspect_ratio = aspectRatio

      if (isMasterEdition) {
        //fetch live supply count
        try {
          const metaplex = new Metaplex(connection)
          const trueSupply = await getMasterEditionSupply(token.mint, metaplex)
  
          if (trueSupply !== undefined) {
            newToken.supply = trueSupply
          }

        } catch (err) {
          console.log("Error fetching live supply: ", err)
        }
      }

      handleTokenToSubmit(newToken) //adds token to list to be submitted when the module is saved
    }
    
    setNewArtModule(prev => ({
      ...prev,
      tokens: [...(prev?.tokens || []), newToken.mint]
    }))
    
    setAdding(false)
  }

  const getAspectRatio = async (imageElement) => {
    try {
      if (videoUrl) {
        //fetch video dimensions
        const video = document.createElement("video")

        return await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve(Number(video.videoWidth / video.videoHeight))
          video.onerror = (err) => reject(new Error(`Unable to load video - ${ err }`));
          video.src = videoUrl
          video.load()
        });
      }
    } catch (err) {
      console.log("Error fetching non-image dimensions: ", err)
      return null
    }

    return Number(imageElement.naturalWidth / imageElement.naturalHeight)
  }
  const handleError = (e) => {
    if (e === IMAGE_FALLBACK_STAGES.METADATA) {
      setImageError(true)
    }
  }

  const infoBadge = useMemo(() => {
    // if (token.compressed) return "C"

    return availableEditions?.length
  }, [availableEditions])
  return (
    <button
      className={clsx(
        "relative flex justify-center flex-shrink-0 rounded-lg overflow-hidden palette2",
        "duration-300 shadow hover:shadow-md",
        "inset-0 w-full pb-[100%]",
        imageError && "hidden"
      )}
      
      key={token.mint}
      onClick={handleAdd}
      disabled={disableAdd}

      ref={itemRef}
    >
      <div className={clsx(
        !isVisible && "hidden",
        "duration-700 opacity-0", show  && "opacity-100"
      )}>
        <div className={clsx(
          infoBadge === undefined && "hidden",
          "palette1 ",
          "rounded-full ring-2 ring-neutral-300 dark:ring-neutral-700",
          "min-w-fit w-6 h-6 absolute top-2 left-2 z-10 flex justify-center items-center",
          "text-leading-none font-bold"
        )}>
          {infoBadge}
        </div>

        {adding ? (
          <div className="absolute inset-0 w-full h-full flex justify-center items-center z-10">
            <Oval color="#FFF" secondaryColor="#666" height={48} width={48} />
          </div>
        ) : null
        }

        <CloudinaryImage
          imageRef={imageRef}
          className={clsx("flex-shrink-0 object-contain shadow-lg ",
            "w-full h-full absolute left-0 top-0",
          )}
          useMetadataFallback
          token={token}
          width={500}
          onError={handleError}
          onLoad={() => setImageLoaded(true)}
          noLazyLoad
        />

        {imageError ? (
          <div
            className="absolute text-center inset-0 p-8 w-full h-full overflow-hidden bg-neutral-200/90 dark:bg-neutral-800/90  
              flex flex-col justify-center items-center rounded-lg z-[15]
            "
          >
            <p>Error loading metadata image</p>
          </div>
        ) : null}

        {alreadyInUse && !token.is_edition && !token.compressed ? (
          <div className="absolute inset-0 flex justify-center items-center z-20">
            <p className=" bg-neutral-200 dark:bg-neutral-800 px-2 rounded-md">Already being used</p>
          </div>
        ) : null}

        {(token.is_edition || token.compressed) && !availableEditions?.length ? (
          <div className="absolute inset-0 flex justify-center items-center z-20">
            <p className=" bg-neutral-200 dark:bg-neutral-800 px-2 rounded-md">All in use</p>
          </div>
        ) : null}

        <div
          className="absolute text-center inset-0 p-8 w-full h-full overflow-hidden bg-neutral-200/90 dark:bg-neutral-800/90 
              transition-opacity duration-300 opacity-0 hover:opacity-100
              flex flex-col justify-center items-center z-20
            "
        >
          <p className="font-bold">{token.name}</p>
          {artistUsername ? <p>by {artistUsername}</p> : null}
          <p className="text-xs">{truncate(token.mint)}</p>
        </div>
      </div>
    </button>
  )
}

export default AddTokenButton