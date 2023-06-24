
import { scale } from "@cloudinary/url-gen/actions/resize";
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
  width, //number | "auto"
  height,
  noFallback = false,
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
  const imageRef = useRef()
  const llRef = useRef()
  const { hasBeenObserved } = useElementObserver(llRef, "500px 500px 500px 500px")

  console.log("CLOUDINARY RENDER")

  const buildCldImg = useCallback((id) => {
    const cldImg = cloudinaryCloud.image(id)
    cldImg
      .format('auto')
      .quality(quality)
      .delivery(dpr("auto"));
  
    if (width) cldImg.resize(scale().width(width))
    return cldImg
  }, [quality, width])

  const cldImg = buildCldImg(id)

  useEffect(() => {
    if (error === "CDN" && fallback) {
      if (fallback?.id) {
        const src = buildCldImg(fallback.id).toURL();
        if (imageRef.current) {
          imageRef.current.src = src
          imageRef.current.style.opacity = 1;
        }
        setError("Using CDN Fallback")
      } else if (fallback.fallbackImage) {
        // imageRef.current.src = fallback.fallbackImage
        // imageRef.current.style.opacity = 1;
        setError("Using Fallback Image")
      }
    }
  }, [error, fallback, buildCldImg])
  

  const handleError = async (e) => {    
    if (!id) {
      console.log("No CDN ID provided")
      return;
    }
    // return console.log("IMAGE ERROR")
    // if (e.target.src.includes("e_vectorize")) {
    //   console.log("Placeholder Error:", e.target.src)
    //   return;
    // }

    e.target.style.opacity = 0;
    e.target.src = "";
    if (noFallback) return;
    if (!error) {
      setError("CDN")
     
      //API call 
      addNonCDNMint(mint)
      // if (metadata?.image && metadata?.mint) {
      //   addNonCDNMetadata(metadata)
      // } else if (mint) {
      //   addNonCDNMint(mint)
      // }
    }
  }

  const handleLoad = (e) => {
    if (onLoad) onLoad(e)
    imageRef.current.style.opacity = 1;
  }

  return (
    <>
      <div ref={noLazyLoad ? null : llRef} className='w-0 h-0  opacity-0' />
      {(errorDisplay && error === errorDisplay.type)
        ? (<div className={clsx(className, "absolute")}>
          {errorDisplay.content}
        </div>)
        : null
      }
      {(hasBeenObserved || noLazyLoad) && (cldImg.toURL()) 
        ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            style={{opacity: 0}}
            ref={imageRef}
            className={className}
            width={width}
            height={height}
            src={cldImg.toURL()} alt=""
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