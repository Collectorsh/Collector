"use client"

import debounce from "lodash.debounce"
import { useEffect, useState } from "react";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  // Handler to call on window resize
  const handleResize = debounce(() => {
    setWindowWidth(window.innerWidth);
    if(Window.innerWidth < 500) setIsMobile(true)
    else setIsMobile(false)
  }, 250); // delay of 250ms

  // Add event listener on mount, and remove on unmount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // don't include handleResize in deps unless you apply useCallback to it 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { windowWidth, isMobile };
};

export default useWindowWidth;