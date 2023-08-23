import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { success, error } from "/utils/toastMessages";
import { OptimizeSingleMint, OptimizeWithMints, OptimizeWithTokens } from "../utils/imageFallback";

import { useCallback } from "react";
import { useRouter } from "next/router";
import UserContext from "./user";
import useActionCable, { makeNotificationsSocketID } from "../hooks/useWebsocket";

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

    //TEST 🚀
    // const unoptimizedTokens = tokens

    //REAL CODE
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

  const addNonCDNMint = useCallback(async (newMint) => {
    //skip if already added
    if (uploadSentRef.current.includes(newMint)) return;
    uploadSentRef.current = [...uploadSentRef.current, newMint];

    setWaiting(prev => prev + 1)
    try {
      await OptimizeSingleMint(newMint, socket_id);
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
      addNonCDNMint,
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

