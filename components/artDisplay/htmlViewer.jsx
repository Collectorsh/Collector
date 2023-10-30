import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import ContentLoader from "react-content-loader"
import useElementObserver from "../../hooks/useElementObserver"
import usePreventTouchNavigation from "../../hooks/usePreventTouch"

const HtmlViewer = ({
  htmlUrl,
  onLoad,
  style,
  wrapperClass = "w-full h-full absolute inset-0",
  useLazyLoading = false
}) => { 
  const [reloadedUrl, setReloadedUrl] = useState(htmlUrl)
  const [loading, setLoading] = useState(true)
  const htmlRef = useRef(null);

  const { isVisible } = useElementObserver(htmlRef, "10px")  
  
  //Lazing load the iframe + reload when size changes
  useEffect(() => {
    if(!useLazyLoading) return
    setLoading(true)
    setReloadedUrl("")

    if (!isVisible) return

    const timeout = setTimeout(() => {
      setReloadedUrl(htmlUrl)
    }, 50)
    return () => clearTimeout(timeout)
  }, [style, htmlUrl, isVisible, useLazyLoading])

  const handleLoad = (e) => {
    if(onLoad) onLoad(e)
    setLoading(false)
  }

  return (
    <div
      ref={ useLazyLoading ? htmlRef : undefined}
      className={clsx(wrapperClass, "z-10")}
    >

      <ContentLoader
        title=""
        speed={2}
        className={clsx(`inset-0 w-full h-full rounded-xl z-50`, loading ? "absolute" : "hidden")}
        style={style}
        backgroundColor="rgba(120,120,120,0.5)"
        foregroundColor="rgba(120,120,120,0.25)"
      >
        <rect className="w-full h-full" />
      </ContentLoader>
   
      <iframe
        onLoad={handleLoad}
        src={reloadedUrl}
        className={clsx(
          "w-full h-full",
          "rounded-lg"
        )}
        style={style}
      />
    </div>
  )
}

export default HtmlViewer