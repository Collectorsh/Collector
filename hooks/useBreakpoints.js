"use client"

import debounce from "lodash.debounce"
import { useEffect, useState } from "react";
import defaultTheme from "tailwindcss/defaultTheme";


const parsePx = (str) => parseInt(str.replace("px", ""))
const tailWindBreakpoints = Object.entries(defaultTheme.screens)
  .sort((a, b) => parsePx(b[1]) - parsePx(a[1])) //sorting so that the largest breakpoint is first


const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState(tailWindBreakpoints[0][0]);

  // Handler to call on window resize
  const handleResize = debounce(() => {
    const newWidth = window.innerWidth
    let newBreakpoint = tailWindBreakpoints.reduce((acc, curr) => { 
      const [key, value] = curr
        const breakpointWidth = parsePx(value)
      if (newWidth <= breakpointWidth) acc = key
      return acc
    }, tailWindBreakpoints[0][0])

    if (breakpoint !== newBreakpoint) {
      setBreakpoint(newBreakpoint)
    }
  }, 50) // delay of 50ms

  // Add event listener on mount, and remove on unmount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize()
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return breakpoint;
};

export default useBreakpoints;