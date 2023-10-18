import "@google/model-viewer";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import usePreventTouchNavigation from "../../hooks/usePreventTouch";

// ref: https://modelviewer.dev/docs/index.html#augmentedreality-attributes

const ModelViewer = ({
  vrUrl,
  onLoad,
  style,
  wrapperClass = "w-full h-full absolute inset-0",
  loading = "eager"
}) => {
  const modelRef = useRef(null);

  usePreventTouchNavigation(modelRef)

  useEffect(() => {
    const modelElement = modelRef.current;
    if (!modelElement) return;

    const handleLoad = (e) => {
      if (onLoad) onLoad(e);
    };

    modelElement.addEventListener("load", handleLoad);

    return () => {
      modelElement.removeEventListener("load", handleLoad);
    };
  })
   
  return (
    <div className={clsx("bg-neutral-100 dark:bg-neutral-800 rounded-lg", wrapperClass)}>
      <model-viewer
        ref={modelRef}
        style={style}
        class="w-full h-full z-10"
        src={vrUrl}
        camera-controls
        auto-rotate
        autoplay
        rotation-per-second="45deg" 
        shadow-intensity="1"
        interaction-prompt="none"
        loading={loading}
        // ar
        // disable-zoom
      ></model-viewer>
    </div>
  );

};


export default ModelViewer;
