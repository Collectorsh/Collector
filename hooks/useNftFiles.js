import { useEffect, useState } from "react";
import { CATEGORIES } from "../components/FileDrop";
import useBreakpoints from "./useBreakpoints";

export const altFileAspectRatio = 1;

const useNftFiles = (token) => {
  const [videoUrl, setVideoUrl] = useState();
  const [htmlUrl, setHtmlUrl] = useState();
  const [vrUrl, setVrUrl] = useState();

  const breakpoint = useBreakpoints()//temporarily disable VR on mobile
  const isMobile = ["", "sm"].includes(breakpoint)

  useEffect(() => {
    if (isMobile) setVrUrl(null)//temporarily disable VR on mobile
    if (!token) return;
    const { videoUrl, htmlUrl, vrUrl } = getAltFileTypes(token)
    setVideoUrl(videoUrl)
    setHtmlUrl(htmlUrl)
    if (!isMobile) setVrUrl(vrUrl) //temporarily disable VR on mobile
  }, [token, isMobile]);

  return {
    videoUrl,
    htmlUrl,
    vrUrl
  }
}

export default useNftFiles


export const getAltFileTypes = (token) => {
  let videoUrl, htmlUrl, vrUrl;

  if (typeof token === "object") {
    if (token.animation_url || token.files?.length > 1) {
      const sections = token.animation_url?.split(".");
      const fileExtension = sections ? sections[sections.length - 1] : null;
      const hasFileExtension = ["mp4", "html", "glb"].includes(fileExtension);
      
      const hasQueryExtension = token.animation_url?.includes("?ext=");

      if (hasFileExtension || hasQueryExtension) {
        const extension = hasQueryExtension
          ? token.animation_url.split("?ext=")[1]
          : fileExtension;

          
        switch (extension) {
          case "mp4":
            videoUrl = token.animation_url;
            // htmlUrl = "https://arweave.net/bBUCfQQxhAGRXoiLeybWg4Zm6A5LdzzbO1004cRX5u0?ext=html";
            // vrUrl = "https://arweave.net/xqDT37dkwDAQolSWOs8F6DOKA3-SaZWgVSI-i-2Ujqs?ext=glb"
            break;
          case "html":
            htmlUrl = token.animation_url;
            break;
          case "glb":
          case "gltf-binary":
            vrUrl = token.animation_url;
            break;
        }
      } else {
        token.files?.forEach(f => {
          if (f.type?.includes("video")) videoUrl = f.uri
          if (f.type?.includes("html")) htmlUrl = f.uri
          if (f.type?.includes("model")) vrUrl = f.uri
        })
      }
    }
  }

  return {
    videoUrl,
    htmlUrl,
    vrUrl
  }
}

export const getTokenAspectRatio = (token) => { 
  const {htmlUrl, vrUrl} = getAltFileTypes(token)
  const isAltMedia = htmlUrl || vrUrl;

  if (isAltMedia) return altFileAspectRatio;
  else return Number(token.aspect_ratio) || 1;
}