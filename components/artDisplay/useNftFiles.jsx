import { useEffect, useState } from "react";

const useNftFiles = (token) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!token) return;

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
            setVideoUrl(token.animation_url);
            break;
          case "html":
            // TODO handle HTML
            break;
          case "glb":
            // TODO handle GLB
            break;
          case "gltf-binary":
            // TODO handle GLB
            break;
        }
      } else {
        token.files?.forEach(f => {
          if (f.type?.includes("video")) setVideoUrl(f.uri)
          // TODO handle other file types
        })
      }
    }
  }, [token]);

  return {
    videoUrl
  }
}

export default useNftFiles