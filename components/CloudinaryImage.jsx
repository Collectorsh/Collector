
import { AdvancedImage, responsive, lazyload, placeholder} from '@cloudinary/react';
import cloudinaryCloud from "../data/client/cloudinary";
import { useState } from "react";
import ImageFallback, { HandleUpload } from "../utils/imageFallback";

//ref 
// Advanced Image plugins: https://cloudinary.com/documentation/react_image_transformations#plugins
// Fetching/optimizations: https://cloudinary.com/documentation/image_optimization 
// Responsive https://cloudinary.com/documentation/responsive_images

//TODO dive further into responsive

const CloudinaryContent = ({
  id,
  mint,
  imageUrl,
  className,
  quality = 'auto', //auto:best | auto:good | auto:eco | auto:low
  responsiveSteps = [],
  onLoad,
  placeholderMode, //pixelate | blur | predominant-color (only use placeholder for large images and make sure to provide width and height to prevent page jumping )
  width,
  height,
  displayError = false,
  noOptimization = false
}) => {
  const [error, setError] = useState(null) 

  const cldImg = cloudinaryCloud.image(id)
  cldImg
    .format('auto')
    .quality(quality)

  const responsivePlugin = responsiveSteps.length ? responsive({ steps: responsiveSteps }) : undefined
  const placeholderPlugin = placeholderMode ? placeholder({ mode: placeholderMode }) : undefined

  const plugins = noOptimization ? undefined : [
    lazyload({ rootMargin: '500px 0px 500px 0px' }),
    responsivePlugin,
    placeholderPlugin,
  ].filter(p => Boolean(p))
  
  const handleError = async (e) => { 
    
    
    if (e.target.src.includes("e_vectorize")) {
      console.log("Placeholder Error:", e.target.src)
      return;
    }

    e.target.style.opacity = 0;

    if (noOptimization) return;


    if (!error) {
      console.log("Error Finding Image In CDN: ", e.target.src)

      if (!mint) return;
      const confirmedImageUrl = await ImageFallback(imageUrl, mint)

      if (!confirmedImageUrl) {
        setError("Unable to fetch image from mint")
        console.log("Error Fetching Image Metadata: ", mint)
        return;
      } 
      e.target.src = confirmedImageUrl;
      e.target.style.opacity = 1;
      //handle upload to Cloudinary
      const uploaded = await HandleUpload(confirmedImageUrl, mint)
      console.log("Uploaded: ", uploaded)
      setError("no image in CDN")
    } else if ("no image in CDN"){
      setError("Bad Image URL")
    }
  }

  return (
    <>
      {(error === "Bad Image URL" && displayError)
        ? (
          <div className="pt-6 text-center opacity-0 hover:opacity-100 duration-200">
            <p>Sorry, we are not able to load this image right now.</p>
            <p className='text-sm opacity-70 mt-3'>Please make sure this token has valid image metadata: <span className='truncate max-w-[4rem] inline-block -mb-1'>{mint}</span> </p>
            <a className="underline text-sm opacity-70" href={`https://explorer.solana.com/address/${ mint }`}>right click me</a>
          </div>
        )
        : (
          <AdvancedImage
            className={className}
            width={width}
            height={height}
            cldImg={cldImg}
            plugins={plugins}
            onLoad={onLoad}
            onError={handleError}
          />
        )}
    </>
  )
}

export default CloudinaryContent;