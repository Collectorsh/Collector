import "@google/model-viewer";
import clsx from "clsx";
import { set } from "ramda";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";

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
  const [lowMemory, setLowMemory] = useState(true);
  const [userLoading, setUserLoading] = useState(false);

  const modelRef = useRef(null);

  const dontLoad = lowMemory && !userLoading

  useEffect(() => {
    console.log("🚀 ~ file: modelDisplay.jsx:40 ~ useEffect ~ navigator.userAgent:", navigator.userAgent)
    //currently not available on safari or firefox
    if (navigator.deviceMemory) { 
      const totalMemory = navigator.deviceMemory; 
      //3gb is the generalized divide between mobile devices and desktops
      if (totalMemory < 4) {
        // Considered as a low-memory device
        setLowMemory(true);
      } else {
        // Considered as a high-memory device
        setLowMemory(false);
      }
    } else if (navigator.hardwareConcurrency) { //backup, makes assumptions about the devices memory based on # of cores 
      
      const totalCores = navigator.hardwareConcurrency;

      if (totalCores <= 6) {
        // Considered as a low-memory device
        setLowMemory(true);
      } else {
        // Considered as a high-memory device
        setLowMemory(false);
      }
    } else {
      const deviceWidth = window.innerWidth
      if (deviceWidth <= 768) {
        // Considered as a low-memory device
        setLowMemory(true);
      } else {
        // Considered as a high-memory device
        setLowMemory(false);
      }
    }
  }, [])

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
    // modelElement.maxPixelRatio = 1

    return () => {
      modelElement.removeEventListener("load", handleLoad);
      modelElement.removeEventListener("error", handleError);
    };
  }, [onLoad, id, dontLoad])   
  
  const opacity = error
    ? "opacity-0"
    : loaded || dontLoad
      ? "opacity-100"
      : "opacity-50"

  return (
    <div
      style={style}
      className={clsx("rounded-lg duration-300 z-10",
      opacity,
        wrapperClass,
        dontLoad ? "bg-transparent" : "bg-neutral-100 dark:bg-neutral-800"
      )}
    >
      
      {(error || dontLoad)
        ? (
          <div className="h-full w-full flex items-end justify-center p-6">
            <div className="text-center bg-neutral-500/50 backdrop-blur-sm rounded p-2 text-black dark:text-white">
              <p className="text-sm" >This device may not support hi-res models</p>
              <MainButton
                className="px-2 mx-auto my-2 text-sm" noPadding
                onClick={() => setUserLoading(true)}
              >
                Try Loading 
              </MainButton>
            </div>
          </div>
        )
        : (
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
            environment-image="null"
          // ar
          // disable-zoom
          ></model-viewer>
        )
      }
    </div>
  );

};


export default memo(ModelViewer);
