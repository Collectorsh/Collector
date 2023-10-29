import "@google/model-viewer";
import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";

// ref: https://modelviewer.dev/docs/index.html#augmentedreality-attributes

const ModelViewer = ({
  vrUrl,
  onLoad,
  style,
  wrapperClass = "w-full h-full absolute inset-0",
  loading = "eager"
}) => {
  const modelRef = useRef(null);

  useEffect(() => {   
    const modelElement = modelRef.current;
    if (!modelElement) return;

    const handleLoad = (e) => {
      if (onLoad) onLoad(e);
    };
    const handleError = (e) => {
      console.log("Error loading model: ", e);
    }

    modelElement.addEventListener("load", handleLoad);
    modelElement.addEventListener("error", handleError);

    return () => {
      modelElement.removeEventListener("load", handleLoad);
      modelElement.removeEventListener("error", handleError);
    };
  },[onLoad])   

  return (
    <div className={clsx("bg-neutral-100 dark:bg-neutral-800 rounded-lg", wrapperClass)}>
      <model-viewer
        ref={modelRef}
        alt=""
        style={style}
        class="w-full h-full z-10"
        src={vrUrl}
        camera-controls
        auto-rotate
        autoplay
        rotation-per-second="10deg"
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
