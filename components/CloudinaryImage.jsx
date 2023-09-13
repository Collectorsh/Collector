
import { scale, limitFill } from "@cloudinary/url-gen/actions/resize";
import { dpr } from "@cloudinary/url-gen/actions/delivery";

import cloudinaryCloud from "../data/client/cloudinary";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from 'clsx';
import useElementObserver from '../hooks/useElementObserver';

import { useFallbackImage, useImageFallbackContext } from '../contexts/imageFallback';
import ContentLoader from 'react-content-loader';
import { HandleNoUrl } from "../utils/imageFallback";


//ref 
// Advanced Image plugins: https://cloudinary.com/documentation/react_image_transformations#plugins
// Fetching/optimizations: https://cloudinary.com/documentation/image_optimization 

//TODO dive further into responsive
// Responsive https://cloudinary.com/documentation/responsive_images

export const getTokenCldImageId = (token) => { 
  if(!token) return null
  //remove special characters and https/http from images link to use as an identifier 
  const clean = (text) => text.replace(/[^\w]/g, '').replace("https", "").replace("http", "");

  //TODO if parent is available from helius then use that instead of image, 
  //and add is_master_edition to the check(they would be the parent)

  //MAKE SURE TO CHANGE THIS IN THE API AS WELL in image service
  return ((token.is_edition) && token.image)
    ? `edition-${clean(token.image)}`
    : token.mint
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
  errorDisplay = {
    type: "CDN",
    content: (
      <ContentLoader
        speed={2}
        className="w-full h-full rounded-lg"
        backgroundColor="rgba(120,120,120,0.2)"
        foregroundColor="rgba(120,120,120,0.1)"
      >
        <rect className="w-full h-full" />
      </ContentLoader>
    )
  }
}) => {
  const { uploadSingleToken } = useImageFallbackContext()
  const fallback = useFallbackImage(token)
  const [error, setError] = useState(null) 
  const llRef = useRef()
  const { isVisible, hasBeenObserved } = useElementObserver(llRef, "100px")
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const [opacity, setOpacity] = useState(noLazyLoad ? 1 : 0)

  // console.log("CLOUDINARY RENDER")

  useEffect(() => {
    if(noLazyLoad) return
    if (isVisible) setOpacity(1)
    else setOpacity(0)
  }, [isVisible, noLazyLoad])

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
    if ((error === "CDN" || error === "Using Metadata Image") && Boolean(fallback)) {
      if (fallback?.imageId) {
        //TODO figure out another way to image cache bust besides adding another transformation (it cost moneys)
        const cldImgFB = buildCldImg(fallback.imageId, "auto:eco")
        
        setFallbackUrl(cldImgFB.toURL())
        setOpacity(1)
        
        setError("Using CDN Return ID")
      } else {
        console.log("Error with fallback:", fallback)
        setError("No Fallback")
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, fallback])
  

  const handleError = async (e) => {   
    setOpacity(0)
    if (!cldId) {
      console.log("No CDN ID provided")
      return;
    }

    if (!error) {
      //assume a CDN error
      setError("CDN")

      if(!token) return

      if (useUploadFallback) uploadSingleToken(token)
      
      if (useMetadataFallback) {
        // USE METADATA URL (NOT OPTIMIZED)
        const image = token?.image || await HandleNoUrl(token.mint)
        if (image) {
          setFallbackUrl(image)
          setOpacity(1)
          setError("Using Metadata Image")
        }
      }
      
    }
  }

  const handleLoad = (e) => {
    console.log("IMAGE LOADED")
    // setFullHeight(e.target.offsetHeight) //for maintaining layouts (currently not using)
    if (onLoad) onLoad(e)
  }

  const lazyStyle = noLazyLoad ? {} : { transitionDuration: "0.3s" }

  return (
    <>
      {noLazyLoad ? null : <div ref={llRef} className='w-1 h-full opacity-0 absolute -z-10' />}
      {(errorDisplay && error === errorDisplay.type)
        ? (<div className={clsx("absolute top-0 left-0 w-full h-full", className)}>
          {errorDisplay.content}
        </div>)
        : null
      }
      {
        (hasBeenObserved || noLazyLoad) && (cldImg.toURL())//(isVisible || noLazyLoad) && //for true lazy load (if using ideally find a way to maintain images in memory so they dont need to be fetched everytime)
        ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            style={{ ...style, opacity, ...lazyStyle }}
            className={className}
            src={fallbackUrl || cldImg.toURL()}
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