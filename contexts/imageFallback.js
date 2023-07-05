import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { success, error } from "/utils/toastMessages";
import { OptimizeWithMints } from "../utils/imageFallback";

import { useCallback } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import UserContext from "./user";
import useWebSocket from "../hooks/useWebsocket";

const ImageFallbackContext = createContext();

export const useImageFallbackContext = () => useContext(ImageFallbackContext);

export const ImageFallbackProvider = ({ children }) => {
  const router = useRouter();
  const [user] = useContext(UserContext);
  // mint addresses that arent associated with a CDN image
  const nonCDNMintsRef = useRef([]);//mint[]
  const uploadSentRef = useRef([]);//mint[]
  const [cloudinaryCompleted, setCloudinaryCompleted] = useState([]);//{mint, imageId}[]
  const [cloudinaryError, setCloudinaryError] = useState([]);//{mint, error}[]
  const [waiting, setWaiting] = useState(0);
  const [completed, setCompleted] = useState(0);

//   useEffect(() => {
//     setWaiting(0)
//     setCompleted(0)
//  },[router.pathname])
  
  // const handleWebsocketMessages = useCallback((message, data) => { 
  //   switch (message) { 
  //     case "Image Optimized": {
  //       const { mint, imageId } = data;
  //       setCloudinaryCompleted(prev => [...prev, { mint, imageId }])
  //       setCompleted(prev => prev + 1)
  //     }
  //     case "Optimizing Error": {
  //       const { mint, error } = data;
  //       setCloudinaryError(prev => [...prev, { mint, error }])
  //       setCompleted(prev => prev + 1)
  //     }
  //     case "Image Metadata Errors": {
  //       const { tokens, error } = data;
  //       setCloudinaryError(prev => [...prev, ...tokens])
  //       setCompleted(prev => prev + tokens.length)
  //     }
  //   }
  // }, [])
  // useWebSocket(handleWebsocketMessages)

  //upload all with mintvisibily : optiomized as nil
  const uploadAll = async (tokens) => { 
    if (!tokens || tokens.length === 0) return;
    const unoptimizedMints = [];
    const errorMints = []
    tokens.forEach((token) => {
      if (token.optimized === "Error") errorMints.push({
        mint: token.mint,
        error: token.optimizedError || "No Error Message",
      })
      else if (token.optimized === "Pending") errorMints.push({
        mint: token.mint,
        error: "Optimization Process Interrupted",
      })
      else if (!token.optimized) {
        unoptimizedMints.push(token.mint)
      }
    })
    setCloudinaryError(prev => [...prev, ...errorMints])

    setWaiting(unoptimizedMints.length)
    setCompleted(0)

    //Trying individualy until websocket (and/or) async workers are fixed
    unoptimizedMints.forEach(async (mint) => { 
      try {
        const res = await OptimizeWithMints([mint], user.username);
        if(!res) throw new Error("No response from server")
        const cloudinaryUpload = res[0];
        if (cloudinaryUpload?.imageId) setCloudinaryCompleted(prev => [...prev, cloudinaryUpload]);
        else setCloudinaryError(prev => [...prev, cloudinaryUpload]);
        console.log("Optimization Request Complete")
      } catch (error) { 
        setCloudinaryError(prev => [...prev, { mint, error: error.message }]);
        console.log("Error optimizing image", error);
      } finally {
        setCompleted(prev => prev + 1)
      }
    })
    //all at once, response depends on websockets
     // await OptimizeWithMints(unoptimizedMints, user.username);
  }
   
  const handleOneUpload = useCallback(async (mint) => { 
    if (uploadSentRef.current.includes(mint)) return;
    setWaiting(prev => prev + 1)
    try {
      uploadSentRef.current = [...uploadSentRef.current, mint];
      const cloudinaryUpload = await OptimizeWithMints([mint], user?.username);
      if (!cloudinaryUpload) return;
      setCloudinaryCompleted(prev => [...prev, ...cloudinaryUpload]);
      setCompleted(prev => prev + 1)
    } catch (error) {
      console.log("Error uploading one image", error);
    }
  }, [user?.username])

  const addNonCDNMint = useCallback((newMint) => {
    //skip if already added
    if (nonCDNMintsRef.current.includes(newMint)) return;
    nonCDNMintsRef.current = [...nonCDNMintsRef.current, newMint];

    handleOneUpload(newMint)
  }, [handleOneUpload])

  // const addNonCDNMetadata = useCallback((newMetadata) => { 
  //   //skip if already added
  //   if (nonCDNMetadatasRef.current.find(prev => prev.mint === newMetadata.mint)) return;
  //   nonCDNMetadatasRef.current = [...nonCDNMetadatasRef.current, newMetadata];

  //   handleImageFallbacks() //similar to handleMetaFallbacks but already have the meata data
  // },[])

  return (
    <ImageFallbackContext.Provider value={{
      uploadAll,
      addNonCDNMint,
      // addNonCDNMetadata,
      cloudinaryCompleted,
      cloudinaryError,
      waiting,
      completed
    }}>
      {children}
    </ImageFallbackContext.Provider>
  );
};

export default ImageFallbackContext;

export const useFallbackImage = (mint) => {
  const { cloudinaryCompleted } = useImageFallbackContext();
  const [completedImage, setCompletedImage] = useState(null);

  useEffect(() => {
    const foundImage = cloudinaryCompleted.find(meta => meta.mint === mint);
    if (foundImage) {
      setCompletedImage(foundImage);
    }
  }, [mint, cloudinaryCompleted]);

  return completedImage;
}