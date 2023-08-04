import { useEffect, useMemo, useRef, useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditArtModuleModal from './editArtModuleModal';
import CloudinaryImage from '../CloudinaryImage';
import clsx from 'clsx';
import MainButton from '../MainButton';
import useBreakpoints from '../../hooks/useBreakpoints';
import { roundToPrecision } from '../../utils/maths';
import Link from 'next/link';
import useElementObserver from '../../hooks/useElementObserver';

const ArtModule = ({ artModule, onEditArtModule, isOwner, submittedTokens, onDeleteModule }) => {
  const breakpoint = useBreakpoints()  
  const [editArtOpen, setEditArtOpen] = useState(false)
  
  
  const itemRows = useMemo(() => {
    const tokens = artModule.tokens
    const isMobile = ["", "sm", "md"].includes(breakpoint)
    const cols = isMobile ? 1 : tokens.length
    
    const useHalfRow = ["lg", "xl"].includes(breakpoint) && tokens.length > 2
    const halfIndex = Math.floor(tokens.length / 2)
    const rows = useHalfRow
    ? [tokens.slice(0, halfIndex), tokens.slice(halfIndex)]
    : [tokens]
    
    return rows.map(tokenRow => tokenRow.map((token, i) => {
      const totalWidthRatio = tokenRow.reduce((acc, token) => acc + token.aspect_ratio, 0)
      const widthPercent = (token.aspect_ratio / totalWidthRatio ) * 100
      return <ArtItem key={token.mint} token={token} widthPercent={widthPercent} columns={cols} />
    }))
  }, [artModule.tokens, breakpoint])

  return (
    <div className="relative group w-full group/artRow min-h-[4rem]">
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditArtOpen(true)}
        placement="outside-tr"
        groupHoverClass="group-hover/artRow:opacity-100"
      >
        {itemRows.map((row, i) => {
          return (
            <div
            key={i}
            className={clsx(
              "flex flex-col md:flex-row w-full gap-6 mb-6",
              )}>
              {row}
            </div>
          )
        })}
      </EditWrapper>
      {isOwner && !artModule.tokens.length
        ? (
          <div className='absolute inset-0 w-full h-full flex justify-center items-center p-2'>
            <p>Click the gear icon in the top left to edit this Art Module</p>
          </div>
        )
        : null
      }
      {isOwner
        ? (
          <EditArtModuleModal
            artModule={artModule}
            onEditArtModule={onEditArtModule}
            onDeleteModule={onDeleteModule}
            isOpen={editArtOpen}
            onClose={() => setEditArtOpen(false)}
            submittedTokens={submittedTokens}
          />
        )
        : null
      }
    </div>
  )
}

export default ArtModule;

export const ArtItem = ({ token, columns, widthPercent }) => {  
  const [loaded, setLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const { isVisible } = useElementObserver(videoRef, "500px")  

  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible && videoLoaded) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }

  }, [isVisible, videoLoaded])

  useEffect(() => {
    if (!token) return;
    try {
      if (token.animation_url) {
        if (token.animation_url.split(".").pop().includes("mp4")) {
          setVideoUrl(token.animation_url);
        }
      } else {
        for (let file of token.properties.files) {
          if (file.type && file.type === "video/mp4") {
            setVideoUrl(file.uri);
          }
        }
      }
    } catch (err) {
      // expected to have some errors
    }
  }, [token]);

  const handleBuy = (e) => {
    alert("Buy")
  }
  return (
    <div
      className={clsx("relative duration-300 max-w-fit mx-auto ",)}
      style={{
        width: columns > 1 ? `${widthPercent}%` : "100%"
      }}
    >
      <Link href={`/nft/${ token.mint }`} >
        <a className='relative block w-fit mx-auto duration-300 overflow-hidden shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg hover:-translate-y-2 active:translate-y-0'>
          {videoUrl && loaded ? (
            <>
              <video
                autoPlay
                ref={videoRef}
                preload="metadata"
                muted
                loop
                playsInline
                id={`video-${ token.mint }`}
                className="mx-auto w-full h-full cursor-pointer object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
                onCanPlayThrough={e => {
                  e.target.classList.add("opacity-100")
                  setVideoLoaded(true)
                }}
                onError={(e) => e.target.classList.add("hidden")}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          ) : null}
        <CloudinaryImage
          className={clsx(
            "object-contain",
           
            "max-h-[75vh]"
          )}
          id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
            noLazyLoad
            onLoad={() => setLoaded(true)}
        />
        </a>
      </Link>
      <div className="w-full mt-2 px-3 mx-auto
      flex flex-wrap gap-3 justify-between items-center"
      >
        <div className='flex flex-col items-start gap-1'>
          <p className='font-bold text-lg'>{token.name} </p>
          <p className=''>by {token.artist}</p>
        </div>
        {token.price
          ? (
            <div className="flex items-center gap-2 flex-wrap">
              <p className='font-bold text-lg'>{roundToPrecision(token.price, 2)}◎</p>
              <MainButton
                onClick={handleBuy}
                className="px-3"
                noPadding
              >Buy Now</MainButton>
            </div>
          )
          : null
          }
      </div>

    </div>
  )
}