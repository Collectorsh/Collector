import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { success, error } from "/utils/toastMessages";
import { MetadataFallbacks } from "../utils/imageFallback";

import { useCallback } from "react";
import debounce from "lodash.debounce";

const ImageFallbackContext = createContext();

export const useImageFallbackContext = () => useContext(ImageFallbackContext);

export const ImageFallbackProvider = ({ children }) => {
  // mint addresses that arent associated with a CDN image
  const nonCDNMintsRef = useRef([]);//mint[]
  const uploadSentRef = useRef([]);//mint[]
  const [cloudinaryCompleted, setCloudinaryCompleted] = useState([]);//{nftMint, id, fallbackImage}[]
  const [waiting, setWaiting] = useState(0);
  //BATCHES (wasnt working well, keeping just incase we move to workers, if so probably remove the sub batchess)
  // const handleMetaFallbacks = debounce(async () => {
  //   console.log("🚀 ~ file: imageFallback.js:32 ~ handleMetaFallbacks ~ nonCDNMintsRef.current.length === muploadSentRef.current.length:", nonCDNMintsRef.current.length, uploadSentRef.current.length)
  //   if (nonCDNMintsRef.current.length === 0 || nonCDNMintsRef.current.length === uploadSentRef.current.length) {
  //     return;
  //   }

  //   const waitingMints = nonCDNMintsRef.current
  //     .filter(mint => !uploadSentRef.current.includes(mint))
    
  //   if (!waitingMints.length) return;
  //   console.log("🚀 ~ file: imageFallback.js:36 ~ handleMetaFallbacks ~ waitingMints:", waitingMints.length)
  //   uploadSentRef.current = [...uploadSentRef.current, ...waitingMints];

  //   const batchSize = 5
  //   for (let i = 0; i < waitingMints.length; i += batchSize) { 
  //     success(`Uploading ${i+batchSize} of ${waitingMints.length} images`)
  //     const batch = waitingMints.slice(i, i + batchSize);
  //     const cloudinaryUploads = await MetadataFallbacks(batch);
  //     if (!cloudinaryUploads) continue;
  //     setCloudinaryCompleted(prev => [...prev, ...cloudinaryUploads]);
  //   }
  // }, 500)

  const handleOneUpload = async (mint) => { 
    if (uploadSentRef.current.includes(mint)) return;
    setWaiting(prev => prev + 1)
    try {
      uploadSentRef.current = [...uploadSentRef.current, mint];
      const cloudinaryUpload = await MetadataFallbacks([mint]);
      if (!cloudinaryUpload) return;
      setCloudinaryCompleted(prev => [...prev, ...cloudinaryUpload]);
    } catch (error) {
      console.log("Error uploading one image", error);
    }
  }


  const addNonCDNMint = useCallback((newMint) => {
    //skip if already added
    if (nonCDNMintsRef.current.includes(newMint)) return;
    nonCDNMintsRef.current = [...nonCDNMintsRef.current, newMint];

    handleOneUpload(newMint)
  }, [])

  // const addNonCDNMetadata = useCallback((newMetadata) => { 
  //   //skip if already added
  //   if (nonCDNMetadatasRef.current.find(prev => prev.mint === newMetadata.mint)) return;
  //   nonCDNMetadatasRef.current = [...nonCDNMetadatasRef.current, newMetadata];

  //   handleImageFallbacks() //similar to handleMetaFallbacks but already have the meata data
  // },[])

  return (
    <ImageFallbackContext.Provider value={{
      addNonCDNMint,
      // addNonCDNMetadata,
      fallbackImages: cloudinaryCompleted,
      waiting
    }}>
      {children}
    </ImageFallbackContext.Provider>
  );
};

export default ImageFallbackContext;

export const useFallbackImage = (mint) => {
  const { fallbackImages} = useImageFallbackContext();
  const fallbackImage = useMemo(() => fallbackImages.find(meta => meta.mint === mint), [mint, fallbackImages]);
  return fallbackImage
}