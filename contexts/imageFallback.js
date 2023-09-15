import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { success, error } from "/utils/toastMessages";
import { OptimizeSingleToken, OptimizeWithTokens } from "../utils/imageFallback";

import { useCallback } from "react";
import { useRouter } from "next/router";
import UserContext from "./user";
import useActionCable, { makeNotificationsSocketID } from "../hooks/useWebsocket";
import { getTokenCldImageId } from "../utils/cloudinary/idParsing";

const ImageFallbackContext = createContext();

export const useImageFallbackContext = () => useContext(ImageFallbackContext);

export const ImageFallbackProvider = ({ children }) => {
  const [user] = useContext(UserContext);
  const router = useRouter();
  // mint addresses that arent associated with a CDN image
  const uploadSentRef = useRef([]);//mint[]
  const [cloudinaryCompleted, setCloudinaryCompleted] = useState([]);//{mint, imageId}[]
  const [cloudinaryError, setCloudinaryError] = useState([]);//{mint, error}[]
  const [waiting, setWaiting] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [uploadAllCompleted, setUploadAllCompleted] = useState(false);

  const socket_id = useMemo(() => makeNotificationsSocketID(router.asPath, user?.username), [user?.username, router.asPath])

  useEffect(() => {
    //reset fallback image state when changing pages
    setWaiting(0)
    setCompleted(0)
    setCloudinaryError([])
    setCloudinaryCompleted([])
    setUploadAllCompleted(false)
  },[router.asPath])

  const handleWebsocketMessages = useCallback(({ message, data }) => {
    switch (message) {
      case "Image Optimized": {
        const { cld_id, imageId } = data;
        setCloudinaryCompleted(prev => [...prev, { cld_id, imageId }])
        setCompleted(prev => prev + 1)
        break;
      }
      case "Optimizing Error": {
        const { cld_id, error } = data;
        setCloudinaryError(prev => [...prev, { cld_id, error }])
        setCompleted(prev => prev + 1)
        break;
      }
      case "Image Metadata Errors": {
        const { tokens, error } = data;
        setCloudinaryError(prev => [...prev, ...tokens])
        setCompleted(prev => prev + tokens.length)
        break;
      }
      case "Resizing Images": {
        const { resizing } = data;
        console.log("Resizing Images", resizing)
        break;
      }
      case "TEST": {
        console.log("TEST", data)
        break;
      }
    }
  }, [])

  useActionCable(socket_id, { received: handleWebsocketMessages })

  //upload all with optiomized as nil
  const uploadAll = async (tokens) => { 
    if (!tokens || tokens.length === 0 || !user?.username) return;

    const errorMints = []
    const unoptimizedTokens = [];

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
        unoptimizedTokens.push(token)
      }
    })
    
    setCloudinaryError(errorMints)

    setWaiting(unoptimizedTokens.length)
    setCompleted(0)

    // BATCH all at once, response depends on websockets
    const res = await OptimizeWithTokens(unoptimizedTokens, socket_id);
    setUploadAllCompleted(true)
    if (res && res.completed) {
      console.log("Completed Batch Upload", res)
    }
  }

  const uploadSingleToken = useCallback(async (token) => {
    //skip if already added
    const cldId = getTokenCldImageId(token);
    const isOptimized = token?.optimized === "True"
    if (uploadSentRef.current.includes(cldId) || isOptimized) return;
    uploadSentRef.current = [...uploadSentRef.current, cldId];

    setWaiting(prev => prev + 1)
    try {
      await OptimizeSingleToken(token, socket_id);
    } catch (error) {
      console.log("Error uploading one image", error);
    }
  }, [socket_id])

  return (
    <ImageFallbackContext.Provider value={{
      setCloudinaryCompleted,
      setCompleted,
      setCloudinaryError,
      uploadAll,
      uploadSingleToken,
      uploadAllCompleted,
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

export const useFallbackImage = (token) => {
  const { cloudinaryCompleted } = useImageFallbackContext();
  const [completedImage, setCompletedImage] = useState(null);
  const cld_id = getTokenCldImageId(token);
  useEffect(() => {
    const foundImage = cloudinaryCompleted.find(meta => meta.cld_id === cld_id);
    if (foundImage) {
      setCompletedImage(foundImage);
    }
  }, [cld_id, cloudinaryCompleted]);

  return completedImage;
}

