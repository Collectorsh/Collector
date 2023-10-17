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
}) => { 
  const [reloadedUrl, setReloadedUrl] = useState(htmlUrl)
  const [loading, setLoading] = useState(false)
  const htmlRef = useRef(null);

  usePreventTouchNavigation(htmlRef)
  const { isVisible } = useElementObserver(htmlRef, "10px")  
  
  //Lazing load the iframe + reload when size changes
  useEffect(() => {
    setLoading(true)
    setReloadedUrl("")

    if (!isVisible) return

    const timeout = setTimeout(() => {
      setReloadedUrl(htmlUrl)
    }, 50)
    return () => clearTimeout(timeout)
  }, [style, htmlUrl, isVisible])

  const handleLoad = (e) => {
    if(onLoad) onLoad(e)
    setLoading(false)
  }

  return (
    <div
      ref={htmlRef}
      className={clsx(
      wrapperClass
      )}
    >
      {loading ? (
        <ContentLoader
          speed={2}
          className={`absolute inset-0 rounded-xl z-50`}
          style={style}
          backgroundColor="rgba(120,120,120,0.75)"
          foregroundColor="rgba(120,120,120,0.5)"
        >
          <rect className="w-full h-full" />
        </ContentLoader>
      ): null}
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