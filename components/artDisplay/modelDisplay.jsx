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
  id = "model-viewer",
  allowUserLoading = true
}) => {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [lowMemory, setLowMemory] = useState(true);
  const [userLoading, setUserLoading] = useState(false);

  const modelRef = useRef(null);

  const dontLoad = lowMemory && !userLoading

  useEffect(() => {
    //check memory first (currently not available on safari or firefox)
    let lowMemory = true;
    if (navigator.deviceMemory) { 
      const totalMemory = navigator.deviceMemory; 
      //3gb is the generalized divide between mobile devices and desktops
      if (totalMemory < 40) {
        // Considered as a low-memory device
        lowMemory = true;
      } else {
        // Considered as a high-memory device
        lowMemory = false;
      }
    } else if (navigator.hardwareConcurrency) { //backup, makes assumptions about the devices memory based on # of cores (not available on safari)
      
      const totalCores = navigator.hardwareConcurrency;

      if (totalCores <= 6) {
        // Considered as a low-memory device
        lowMemory = true;
      } else {
        // Considered as a high-memory device
        lowMemory = false;
      }
    } else {
      //final backup, makes assumptions about the devices memory based on screen size
      const deviceWidth = window.innerWidth
      if (deviceWidth <= 768) { //tablet width
        // Considered as a low-memory device
        lowMemory = true;
      } else {
        // Considered as a high-memory device
        lowMemory = false;
      }
    }

    if (lowMemory) onLoad && onLoad({lowMemory})
    setLowMemory(lowMemory);
  }, [onLoad])

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
            {/* <div className="text-center bg-neutral-500/50 backdrop-blur-sm rounded px-2 py-1 text-black dark:text-white"> */}
              {allowUserLoading
                ? (<>
                  <MainButton
                    solid
                    className="px-2 py-0.5 mx-auto shadow text-sm text-center" noPadding
                    onClick={() => setUserLoading(true)}
                  >
                    Load high-res model
                  </MainButton>
                </>)
              : <p className="text-sm text-center bg-neutral-500/50 backdrop-blur-sm rounded px-2 py-1" >Click to view high-res model</p>
              }
            {/* </div> */}
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
