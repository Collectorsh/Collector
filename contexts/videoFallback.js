import { createContext, useContext, useEffect, useRef, useState } from "react";
import apiClient from "../data/client/apiClient";
import { UploadVideo } from "../utils/imageFallback";

const VideoFallbackContext = createContext();

export const useVideoFallbackContext = () => useContext(VideoFallbackContext);

export const VideoFallbackProvider = ({ children }) => { 
  const uploadSentRef = useRef([]);//mint[]
  const [cloudinaryCompleted, setCloudinaryCompleted] = useState({});//{mint: videoId}

  const uploadVideo = async (token, videoUrl) => { 
    if (uploadSentRef.current.includes(token.mint)) {
      console.log("ALREADY UPLADING VIDEO")
      return;
    }
    console.log("UPLADING VIDEO")

    uploadSentRef.current.push(token.mint)

    const cldResponse = await UploadVideo(token, videoUrl)
    
    const videoId = cldResponse.public_id
    setCloudinaryCompleted(prev => ({...prev, [token.mint]: videoId}))
  }

  return (
    <VideoFallbackContext.Provider value={{
      uploadVideo,
      cloudinaryCompleted
    }}>
      {children}
    </VideoFallbackContext.Provider>
  )
}

export const useFallbackVideo = (token) => { 
  const { cloudinaryCompleted } = useVideoFallbackContext();
  const [completedVideo, setCompletedVideo] = useState(null);

  useEffect(() => {
    if (!token) return;
    const cldId = cloudinaryCompleted[token.mint]
    if (cldId) setCompletedVideo(cldId)
  }, [token, cloudinaryCompleted])

  return completedVideo
}