import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { success, error } from "/utils/toastMessages";
import { OptimizeWithMints } from "../utils/imageFallback";

import { useCallback } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import UserContext from "./user";
import useActionCable from "../hooks/useWebsocket";
import dynamic from "next/dynamic";

// const useWebSocket = dynamic(() => import("../hooks/useWebsocket"), { ssr: false });

const ImageFallbackContext = createContext();

export const useImageFallbackContext = () => useContext(ImageFallbackContext);

export const ImageFallbackProvider = ({ children }) => {
  const [user] = useContext(UserContext);
  // mint addresses that arent associated with a CDN image
  const nonCDNMintsRef = useRef([]);//mint[]
  const uploadSentRef = useRef([]);//mint[]
  const [cloudinaryCompleted, setCloudinaryCompleted] = useState([]);//{mint, imageId}[]
  const [cloudinaryError, setCloudinaryError] = useState([]);//{mint, error}[]
  const [waiting, setWaiting] = useState(0);
  const [completed, setCompleted] = useState(0);

  const handleWebsocketMessages = useCallback(({ message, data }) => {
    switch (message) {
      case "Image Optimized": {
        const { mint, imageId } = data;
        setCloudinaryCompleted(prev => [...prev, { mint, imageId }])
        setCompleted(prev => prev + 1)
        break;
      }
      case "Optimizing Error": {
        const { mint, error } = data;
        setCloudinaryError(prev => [...prev, { mint, error }])
        setCompleted(prev => prev + 1)
        break;
      }
      case "Image Metadata Errors": {
        const { tokens, error } = data;
        setCloudinaryError(prev => [...prev, ...tokens])
        setCompleted(prev => prev + tokens.length)
        break;
      }
      case "TEST": {
        console.log("TEST", data)
        break;
      }
    }
  }, [])

  useActionCable({ received: handleWebsocketMessages }, user)

  //upload all with mintvisibily : optiomized as nil
  const uploadAll = async (tokens) => { 
    if (!tokens || tokens.length === 0) return;
    const errorMints = []

    //TEST
    const unoptimizedMints = tokens.map(tok => tok.mint)
    
    //REAL CODE
    // const unoptimizedMints = [];
    // console.log("🚀 ~ file: imageFallback.js:67 ~ uploadAll ~ unoptimizedMints:", unoptimizedMints)
    // tokens.forEach((token) => {
    //   if (token.optimized === "Error") errorMints.push({
    //     mint: token.mint,
    //     error: token.optimizedError || "No Error Message",
    //   })
    //   else if (token.optimized === "Pending") errorMints.push({
    //     mint: token.mint,
    //     error: "Optimization Process Interrupted",
    //   })
    //   else if (!token.optimized) {
    //     unoptimizedMints.push(token.mint)
    //   }
    // })

    setCloudinaryError(prev => [...prev, ...errorMints])

    setWaiting(unoptimizedMints.length)
    setCompleted(0)
    
    // BATCH all at once, response depends on websockets
    OptimizeWithMints(unoptimizedMints, user.username);
  }
   
  const handleOneUpload = useCallback(async (mint) => { 
    if (uploadSentRef.current.includes(mint)) return;
    setWaiting(prev => prev + 1)
    try {
      uploadSentRef.current = [...uploadSentRef.current, mint];
      await OptimizeWithMints([mint], user?.username);
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
      setCloudinaryCompleted,
      setCompleted,
      setCloudinaryError,
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

