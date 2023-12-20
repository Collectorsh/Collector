import clsx from "clsx"
import { useEffect, useRef, useState } from "react";
import useElementObserver from "../../hooks/useElementObserver";
import useBreakpoints from "../../hooks/useBreakpoints";
import ContentLoader from "react-content-loader";

const VideoPlayer = ({
  id = "video-player",
  videoUrl,
  videoLoaded,
  setVideoLoaded,
  wrapperClass="absolute inset-0 z-10 w-full h-full group/controls",
  controlsClass,
  style,
  handleRefWidthChange
}) => { 
  const videoRef = useRef(null);
  const [userMuted, setUserMuted] = useState(true)
  const [userPaused, setUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const breakpoint = useBreakpoints()
  const isMobile = ["", "sm", "md"].includes(breakpoint)
  const { isVisible } = useElementObserver(videoRef, "10px")  

  const bufferTimerIdRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || loading) return;

    const handleIsPlaying = () => setIsPlaying(true)
    const handleIsPaused = () => setIsPlaying(false)
    const handleBuffering = () => {
      if (!videoLoaded) return; 
      const timerId = setTimeout(() => { 
        setIsBuffering(true)
      }, 3000)
      bufferTimerIdRef.current = timerId
    }
    const handleBufferEnded = () => {
      clearTimeout(bufferTimerIdRef.current)
      setIsBuffering(false)
    }

    videoElement.addEventListener('play', handleIsPlaying);
    videoElement.addEventListener('pause', handleIsPaused);
    videoElement.addEventListener('waiting', handleBuffering);
    videoElement.addEventListener('playing', handleBufferEnded);

    //TODO, figure out how to handle videos with width larger than the window 
    //or that would mess up the aspect ratio when constraining the height
    // const handleWidthChange = () => {
    //   if (!handleRefWidthChange) return;

    //   const width = videoElement.videoWidth
    //   console.log("🚀 ~ file: videoPlayer.jsx:39 ~ handleWidthChange ~ width :", width )
    //   handleRefWidthChange(width)
    // }
    // window.addEventListener('resize', handleWidthChange)
    // handleWidthChange()
      

    return () => {
      clearTimeout(bufferTimerIdRef.current)
      videoElement.removeEventListener('play', handleIsPlaying);
      videoElement.removeEventListener('pause', handleIsPaused);
      videoElement.removeEventListener('waiting', handleBuffering);
      videoElement.removeEventListener('playing', handleBufferEnded);

      // window.removeEventListener('resize', handleWidthChange);
    };
  }, [handleRefWidthChange, videoLoaded, loading]);

  useEffect(() => {
    if (!videoRef.current || userPaused || loading) return;
    if (isVisible) {
      if (!isMobile) videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [isVisible, userPaused, isMobile, loading])
  
  const preventPropAndDefault = (e) => {
    e.preventDefault();
    e.stopPropagation()
  }
  const handlePlayToggle = (e) => {
    preventPropAndDefault(e)
    if (!videoRef.current || loading) return;
    if (videoRef.current.paused) {
      videoRef.current.play()
      setUserPaused(false)
    } else {
      videoRef.current.pause()
      setUserPaused(true)
    }
  }
  const handleMuteToggle = (e) => {
    preventPropAndDefault(e)
    if (!videoRef.current) return;
    setUserMuted(prev => {
      videoRef.current.muted = !prev
      return !prev
    })
  }

  return (
    <div
      className={wrapperClass}
      onClick={handlePlayToggle}
    >
      <PlayButton
        onClick={handlePlayToggle}
        iconClassName="w-7 h-7"
        isPlaying={isPlaying}
        className={controlsClass}
        // disabled={isBuffering}
      />
      <MuteButton
        onClick={handleMuteToggle}
        iconClassName="w-7 h-7"
        isMuted={userMuted}
        className={controlsClass}
        // disabled={isBuffering}
      />

      <div className={clsx("absolute inset-0 h-full w-full flex pb-6 items-end justify-center duration-1000",
        isBuffering ? "opacity-100" : "opacity-0",
      )}>
        <p className="bg-neutral-500/50 animate-pulse backdrop-blur-sm rounded px-2">
          Buffering...
        </p>
      </div>
      <div className={clsx("absolute inset-0 h-full w-full flex pb-6 items-end justify-center duration-1000",
        error ? "opacity-100" : "opacity-0",
      )}>
        <p className="bg-red-500/50 backdrop-blur-sm rounded px-2">
          Error loading video
        </p>
      </div>

      <ContentLoader
        title=""
        speed={2}
        className={clsx(`inset-0 w-full h-full rounded-xl z-50 duration-500`, loading ? "opacity-75 absolute" : "opacity-0 hidden")}
        style={style}
        backgroundColor="rgba(120,120,120,0.5)"
        foregroundColor="rgba(120,120,120,0.25)"
      >
        <rect className="w-full h-full" />
      </ContentLoader>

      <video
        
        style={style}
        ref={videoRef}
        // preload="metadata"
        autoPlay={!isMobile}
        muted
        loop
        playsInline
        id={id}
        className={clsx("mx-auto h-full object-center object-contain duration-300 opacity-0 rounded-lg")}
      
        onCanPlay={e => {
          e.target.classList.add("opacity-100")
          setLoading(false)
          if (setVideoLoaded) setVideoLoaded(true)
          setError(false)
        }}
        onError={(e) => {
          e.target.classList.add("hidden")
          setError(true)
        }}
      >
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer

export const MuteButton = ({ isMuted, onClick, className, iconClassName, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx("absolute z-[15] right-5 bottom-5 p-0.5",
        "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
        "duration-300",
        "md:opacity-50 hover:opacity-100 group-hover:opacity-100",
        "hover:scale-110 active:scale-100",
        "disabled:blur-[1px]",
        className
      )}
    >
      {isMuted
        ? < svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconClassName}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconClassName}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      }
    </button>
  )
}

export const PlayButton = ({ isPlaying, onClick, className, iconClassName, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx("absolute z-[15] left-5 bottom-5 p-0.5",
        "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
        "duration-300",
        "md:opacity-50 hover:opacity-100 group-hover:opacity-100",
        "hover:scale-110 active:scale-100",
        "disabled:blur-[1px]",
        className
      )}
    >
      {isPlaying
        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconClassName}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconClassName}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      }
    </button>
  )
}