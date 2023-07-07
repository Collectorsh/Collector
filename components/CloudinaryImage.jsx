
import { scale, limitFill } from "@cloudinary/url-gen/actions/resize";
import { dpr } from "@cloudinary/url-gen/actions/delivery";

import cloudinaryCloud from "../data/client/cloudinary";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from 'clsx';
import useElementObserver from '../hooks/useElementObserver';

import { useFallbackImage, useImageFallbackContext } from '../contexts/imageFallback';
import ContentLoader from 'react-content-loader';


//ref 
// Advanced Image plugins: https://cloudinary.com/documentation/react_image_transformations#plugins
// Fetching/optimizations: https://cloudinary.com/documentation/image_optimization 

//TODO dive further into responsive
// Responsive https://cloudinary.com/documentation/responsive_images

const CloudinaryImage = ({
  id,
  mint,
  metadata, //offchain metadata
  className,
  quality = 'auto', //auto:best | auto:good | auto:eco | auto:low
  onLoad,
  onError,
  width, //number | "auto"
  height,
  useUploadFallback = false,
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
  const { addNonCDNMint } = useImageFallbackContext()
  const fallback = useFallbackImage(mint)
  const [error, setError] = useState(null) 
  const llRef = useRef()
  const { hasBeenObserved } = useElementObserver(llRef, "1000px 1000px 1000px 1000px")

  const [fallbackUrl, setFallbackUrl] = useState(null)
  const [opacity, setOpacity] = useState(noLazyLoad ? 1 : 0)

  // console.log("CLOUDINARY RENDER")

  const buildCldImg = (id, overrideQuality) => {
    const cldImg = cloudinaryCloud.image(id)
    cldImg
      .format('auto')
      .quality(overrideQuality || quality)
      .delivery(dpr("auto"));
  
    if (width) cldImg.resize(limitFill().width(width))
    // cloudinaryCloud.resize.limit().width(width)
    return cldImg
  }

  const cldImg = buildCldImg(id)

  useEffect(() => {
    if (error === "CDN" && Boolean(fallback)) {
      if (fallback?.imageId) {
        //TODO figure out another way to image cache bust besides adding another transformation (it cost moneys)
        const cldImgFB = buildCldImg(fallback.imageId, "auto:eco")
        
        setFallbackUrl(cldImgFB.toURL())
        setOpacity(1)
        
        setError("Using CDN Return ID")
      } else if (fallback?.fallbackImage) {
        //handle no CDN image

        // setFallbackUrl(fallback.fallbackImage)
        // setOpacity(1)

        setError("Using Metadata Fallback Image")
      } else {
        console.log("Error with fallback:", fallback)
        setError("No Fallback")
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, fallback])
  

  const handleError = async (e) => {    
    setOpacity(0)
    if (!id) {
      console.log("No CDN ID provided")
      return;
    }
    // console.log("IMAGE ERROR", id, error)

    if (!error) {
      //API call 

      if(useUploadFallback) addNonCDNMint(mint)
      // if (metadata?.image && metadata?.mint) {
      //   addNonCDNMetadata(metadata)
      // } else if (mint) {
      //   addNonCDNMint(mint)
      // }
    
      setError("CDN")
    
      //USE METADATA URL (NOT OPTIMIZED)
      // const image = await HandleNoUrl(mint)
      // setFallbackUrl(image)
      // setOpacity(1)
      // setError("Using fetched meta Fallback Image")
      
    }
  }

  const handleLoad = (e) => {
    setOpacity(1) 
    if (onLoad) onLoad(e)
  }
  
  return (
    <>
      <div ref={noLazyLoad ? null : llRef} className='w-0 h-0  opacity-0' />
      {(errorDisplay && error === errorDisplay.type)
        ? (<div className={clsx("absolute top-0 left-0 w-full h-full", className)}>
          {errorDisplay.content}
        </div>)
        : null
      }
      {(hasBeenObserved || noLazyLoad) && (cldImg.toURL()) 
        ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            style={{opacity}}
            className={className}
            width={width}
            height={height}
            src={fallbackUrl || cldImg.toURL()}
            alt={metadata?.name || ""}
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