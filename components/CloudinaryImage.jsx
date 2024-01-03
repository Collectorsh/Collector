
import { limitFill, scale } from "@cloudinary/url-gen/actions/resize";
import { dpr } from "@cloudinary/url-gen/actions/delivery";

import cloudinaryCloud from "../data/client/cloudinary";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from 'clsx';
import useElementObserver from '../hooks/useElementObserver';

import { useFallbackImage, useImageFallbackContext } from '../contexts/imageFallback';
import { HandleNoUrl } from "../utils/imageFallback";
import { getTokenCldImageId } from "../utils/cloudinary/idParsing";
import ContentLoader from 'react-content-loader';

//ref 
// Advanced Image plugins: https://cloudinary.com/documentation/react_image_transformations#plugins
// Fetching/optimizations: https://cloudinary.com/documentation/image_optimization 

export const IMAGE_FALLBACK_STAGES = {
  MAIN_CDN: "MAIN_CDN",
  SECONDARY_CDN: "SECONDARY_CDN",
  METADATA: "METADATA",
  UPLOADED_FALLBACK: "UPLOADED_FALLBACK",
  UPLOADED_FALLBACK_FAILED: "UPLOADED_FALLBACK_FAILED",
  NO_FALLBACK: "NO_FALLBACK",
}

const CloudinaryImage = ({
  id,
  token,
  className,
  style,
  quality = 'auto', //auto:best | auto:good | auto:eco | auto:low
  onLoad,
  imageRef,
  width, //number | "auto"
  useUploadFallback = false,
  useMetadataFallback = false,
  noLazyLoad = false,
  onError
}) => {
  const { uploadSingleToken } = useImageFallbackContext()
  const fallback = useFallbackImage(token)
  const llRef = useRef()
  const { isVisible, hasBeenObserved } = useElementObserver(llRef, "100px")
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const [opacity, setOpacity] = useState(noLazyLoad ? 1 : 0)
  
  const [fallbackStage, setFallbackStage] = useState(IMAGE_FALLBACK_STAGES.MAIN_CDN)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) 

  const internalRef = useRef(null)

  useEffect(() => {
    if(noLazyLoad || error || loading) return
    if (isVisible) setOpacity(1)
    else setOpacity(0)
  }, [isVisible, noLazyLoad, error, loading])

  const buildCldImg = (id, overrideQuality) => {
    const cldImg = cloudinaryCloud.image(id)
    cldImg
      .format('auto')
      .quality(overrideQuality || quality)
      .delivery(dpr("auto"));
  
    if (width) cldImg.resize(limitFill().width(width))
    return cldImg
  }

  const tokenID = Boolean(token) ? `${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ getTokenCldImageId(token) }` : null
  const cldId = tokenID || id
  const cldImg = buildCldImg(cldId)

  useEffect(() => {
    //Don't set uploaded fallback if we are on the initial MAIN_CDN stage, or if we've already tried the fallback
    const excludedStages = [IMAGE_FALLBACK_STAGES.MAIN_CDN, IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK, IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK_FAILED]
    if (!excludedStages.includes(fallbackStage) && Boolean(fallback)) {
      if (fallback?.imageId) {
        //TODO figure out another way to image cache bust besides adding another transformation (it cost moneys)
        const cldImgFB = buildCldImg(fallback.imageId, "auto:eco")
        
        setFallbackUrl(cldImgFB?.toURL())
        setLoading(true)
        setError(false)
        setFallbackStage(IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK)
      } 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallbackStage, fallback])
  

  const handleError = async (e) => {   
    setOpacity(0)
    setError(true)

    if(onError) onError(fallbackStage)

    if (!token) {
      setFallbackStage(IMAGE_FALLBACK_STAGES.NO_FALLBACK)
      console.log("Bad ID and No Token")
      return;
    }

    let image;

    //IF the MAIN CDN FAILS
    if (fallbackStage === IMAGE_FALLBACK_STAGES.MAIN_CDN) {
      if (useUploadFallback) uploadSingleToken(token) //try to upload to MAIN CDN
      image = token?.image_cdn
      if (image) setFallbackStage(IMAGE_FALLBACK_STAGES.SECONDARY_CDN)
    }
    
    //IF there is no secondary CDN image 
    //OR if we are on the not on MAIN_CDN stage and the fallback image has errored
    //AND metadata is allowed (not optimal for pages lots of images)
    //AND we are not already on the METADATA/UPLOADED_FALLBACK_FAILED stage (meaning the metadata/uploaded fallback has errored too)
    const excludedStages = [IMAGE_FALLBACK_STAGES.METADATA, IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK_FAILED]
    if (useMetadataFallback && !image && !excludedStages.includes(fallbackStage)) {
      image = token?.image || await HandleNoUrl(token.mint) 
      if (image) {
        //if we've tried the uploaded fallback and it failed we leave the fallback image as metadata and dont try again
        if (fallbackStage === IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK) setFallbackStage(IMAGE_FALLBACK_STAGES.UPLOADED_FALLBACK_FAILED)
        else setFallbackStage(IMAGE_FALLBACK_STAGES.METADATA)
      }
    }

    if (image) {
      setFallbackUrl(image)
      setError(false)
      setLoading(true)
    }
  }


  const handleLoad = useCallback((e) => {
    setLoading(false)
    setError(false)
    if (noLazyLoad) setOpacity(1)
    if (onLoad) onLoad(e)
  }, [noLazyLoad, onLoad])

  useEffect(() => {
    if (!internalRef) return
    //handle race condition where load event fires before rendered
    const id = setTimeout(() => {
      if (internalRef.current?.complete) handleLoad()
    }, 100)
    
    return () => clearTimeout(id)
  }, [internalRef, handleLoad])

  return (
    <>
      {noLazyLoad ? null : <div ref={llRef} className='w-1 h-full opacity-0 absolute -z-10' />}
      {(loading)
        ? (<div className={clsx("absolute z-10 top-0 left-0 w-full h-full overflow-hidden", className)}>
          <ContentLoader
            title=""
            id={token?.mint || id}
            speed={2}
            className="w-full h-full rounded-lg"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-full" />
          </ContentLoader>
        </div>)
        : null
      }
      {
        (hasBeenObserved || noLazyLoad) && (cldImg?.toURL())
        ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
              ref={(el) => { 
                internalRef.current = el
                if (imageRef) imageRef.current = el
              }}
              style={{
                color: "transparent",
                transitionDuration: "0.3s",
                ...style,
                opacity,
              }}
            className={className}
            src={fallbackUrl || cldImg?.toURL()}
            alt={token?.name || ""}
            onLoad={handleLoad}
            onError={handleError}
          />
        )
        : null
      }

    </>
  )
}

export default CloudinaryImage;