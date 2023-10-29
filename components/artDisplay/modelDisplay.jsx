import "@google/model-viewer";
import clsx from "clsx";
import { set } from "ramda";
import { memo, useEffect, useMemo, useRef, useState } from "react";

// ref: https://modelviewer.dev/docs/index.html#augmentedreality-attributes

const ModelViewer = ({
  vrUrl,
  onLoad,
  style,
  wrapperClass = "w-full h-full absolute inset-0",
  loading = "eager",
  id = "model-viewer"
}) => {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const modelRef = useRef(null);

  useEffect(() => {   
    const modelElement = modelRef.current;
    if (!modelElement) return;

    const handleLoad = (e) => {
      setLoaded(true);  
      if (onLoad) onLoad(e);
    };
    const handleError = (e) => {
      console.log("Error loading model: ", e);
      setError(e);
    }

    modelElement.addEventListener("load", handleLoad);
    modelElement.addEventListener("error", handleError);

    return () => {
      modelElement.removeEventListener("load", handleLoad);
      modelElement.removeEventListener("error", handleError);
    };
  }, [onLoad, id])   
  
  const opacity = error
    ? "opacity-0"
    : loaded
      ? "opacity-100"
      : "opacity-50"

  return (
    <div
      style={style}
      className={clsx("bg-neutral-100 dark:bg-neutral-800 rounded-lg duration-300 z-10",
      opacity,
      wrapperClass,
      )}
    >
      
      {!error ?
        <model-viewer
          ref={modelRef}
          alt=""
          class={clsx("w-full h-full")}
          src={vrUrl}
          camera-controls
          auto-rotate
          autoplay
          rotation-per-second="10deg"
          shadow-intensity="1"
          interaction-prompt="none"
          loading={loading}
          modelCacheSize="0"
        // ar
        // disable-zoom
        ></model-viewer>
      : null}

    </div>
  );

};


export default memo(ModelViewer);
