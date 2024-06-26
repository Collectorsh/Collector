import { useEffect, useRef } from "react";
import useElementObserver from "../hooks/useElementObserver";

const LazyLoader = ({cb, rootMargin = "20px"}) => {
  const ref = useRef(null)
  const { isVisible } = useElementObserver(ref, rootMargin)
  
  useEffect(() => {
    let interId
    if (isVisible) {
      cb()
      interId = setInterval(() => { 
        cb()
      }, 500)
    } else clearInterval(interId)

    return () => clearInterval(interId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])
  
  return (
    <div className="w-full flex justify-center p-6" ref={ref}>
      <svg className="animate-spin" fill="none" height={40} viewBox="0 0 24 24" width={40} xmlns="http://www.w3.org/2000/svg">
        <path clipRule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="current" fillRule="evenodd" opacity="0.2" />
        <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" />
      </svg>
    </div>
  )
} 

export default LazyLoader