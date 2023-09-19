import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditArtModuleModal from './editArtModuleModal';
import CloudinaryImage from '../CloudinaryImage';
import clsx from 'clsx';
import MainButton from '../MainButton';
import useBreakpoints from '../../hooks/useBreakpoints';
import { roundToPrecision } from '../../utils/maths';
import Link from 'next/link';
import useElementObserver from '../../hooks/useElementObserver';
import { Oval } from 'react-loader-spinner';
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import UserContext from '../../contexts/user';

const ArtModule = ({ artModule, onEditArtModule, isOwner, submittedTokens, onDeleteModule, approvedArtists, handleCollect }) => {
  const breakpoint = useBreakpoints()  
  const [editArtOpen, setEditArtOpen] = useState(false)

  const wrapperRef = useRef(null)
  const { isVisible } = useElementObserver(wrapperRef, "400px")

  // const [rowHeight, setRowHeight] = useState(0)
  // const [rowWidth, setRowWidth] = useState(0)
  // const rowRef = useRef(null)

  // useEffect(() => { 
  //   const getRowHeight = () => { 
  //     if(!rowRef.current) return
  //     const rowHeight = rowRef.current.offsetHeight
  //     setRowHeight(rowHeight)

  //     const rowWidth = rowRef.current.offsetWidth
  //     setRowWidth(rowWidth)
  //   }
  //   getRowHeight()
  //   window.addEventListener('resize', getRowHeight)
  //   return () => window.removeEventListener('resize', getRowHeight)
  // }, [])
  
  const itemRows = useMemo(() => {
    if(!approvedArtists || !submittedTokens) return []

    const tokenMints = artModule.tokens
    const isMobile = ["", "sm", "md"].includes(breakpoint)
    const cols = isMobile ? 1 : tokenMints.length
    
    const useHalfRow = ["lg", "xl"].includes(breakpoint) && tokenMints.length > 2
    const halfIndex = Math.floor(tokenMints.length / 2)
    const rows = useHalfRow
    ? [tokenMints.slice(0, halfIndex), tokenMints.slice(halfIndex)]
    : [tokenMints]
    
    return rows.map(tokenRow => tokenRow.map((tokenMint, i) => {
      const token = submittedTokens.find(t => t.mint === tokenMint)
      if (!token) return null
      const artist = approvedArtists.find(a => a.id === token.artist_id)
      const totalWidthRatio = tokenRow.reduce((acc, token) => acc + Number(token.aspect_ratio), 0)
      const widthPercent = (Number(token.aspect_ratio) / totalWidthRatio) * 100
      // const width = (widthPercent / 100) * rowWidth
      return (
        <ArtItem
          isMobile={isMobile}
          key={tokenMint}
          token={token}
          widthPercent={widthPercent}
          columns={cols}
          artist={artist}
          handleCollect={handleCollect}
          // height={rowHeight}
          // width={width}
        />
      )
    })).filter(row => Boolean(row))
  }, [artModule.tokens, breakpoint, submittedTokens, approvedArtists, handleCollect])

  return (
    <div
      ref={wrapperRef}
      className={clsx("relative group w-full group/artRow min-h-[4rem] duration-300", isVisible ? "opacity-100" : "opacity-0")}
    >
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditArtOpen(true)}
        placement="outside-tr"
        groupHoverClass="group-hover/artRow:opacity-100"
      >
        {itemRows.map((row, i) => {
          return (
            <div
            key={artModule.id + "row" + i}
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

export const ArtItem = ({ token, columns, widthPercent, artist, handleCollect, height, width, isMobile }) => {  
  const [user] = useContext(UserContext);

  const [loaded, setLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [purchasing, setPurchasing] = useState(false)
  const videoRef = useRef(null);

  // const [isWrapped, setIsWrapped] = useState(false)
  // const wrapContainerRef = useRef(null);
  // const wrapItemRef = useRef(null);

  const { isVisible } = useElementObserver(videoRef, "500px")  

  const isMasterEdition = token.is_master_edition
  const isEdition = token.is_edition
  const supply = token.supply
  const maxSupply = token.max_supply

  const isListed = token.listed_status === "listed"
  const isSold = token.listed_status === "sold" || isMasterEdition && supply >= maxSupply

  const supplyText = isMasterEdition
    ? `${ maxSupply - supply }/${ maxSupply } Editions`
    : "1 of 1"
  
  const cacheWidth = useMemo(() => { 
    if (isMobile) return 1600
    switch (columns) { 
      case 1: return 3000
      case 2: return 2000
      case 3: return 1600
      case 4: return 1200
      default: return 1200
    }
  }, [columns, isMobile])

  // useEffect(() => {
  //   const findIsWrapped = () => {
  //     const isWrapped = wrapContainerRef.current.offsetHeight - wrapItemRef.current.offsetHeight > 30//30px threshold 
  //     setIsWrapped(isWrapped)
  //   }
  //   findIsWrapped()
  //   window.addEventListener('resize',findIsWrapped)
  //   return () => window.removeEventListener('resize', findIsWrapped)
  // }, [])

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

    if (token.animation_url) {
      if (token.animation_url.split(".").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      }
    }
  }, [token]);

  const handleBuy = async (e) => {
    if (!handleCollect || !user) return;

    setPurchasing(true)
    await handleCollect(token)
    setPurchasing(false)
  }
  
  return (
    <div
      className={clsx("relative duration-300 max-w-fit mx-auto ",)}
      style={{
        width: columns > 1 ? `${ widthPercent }%` : "100%",
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
            token={token}
            className={clsx(
              "object-contain",
              "max-h-[75vh]",
            )}
            width={cacheWidth}
            noLazyLoad
            onLoad={() => setLoaded(true)}
          />

        </a>
      </Link>
      <div
        className="w-full mt-4 px-4 mx-auto
          flex flex-wrap gap-x-6 gap-y-3 justify-between items-start"
        // ref={wrapContainerRef}
      >
        <div
          className={clsx('flex gap-1', "flex-col items-start")}
        >
          <p className='font-bold text-2xl leading-8'>{token.name}</p>

          {artist ? (
            <p>by {artist.username}</p>
          ) : null}

          <div className='flex items-center gap-2 '>
            {(token?.buy_now_price)
              ? <>
                <p className=''>{roundToPrecision(token.buy_now_price, 2)}◎</p>
                <span>-</span>
              </>
              : null
            }
            <span className=''>{supplyText}</span>
          </div>
        </div>
        <div
          // ref={wrapItemRef}
          className={clsx(
            'flex flex-col gap-1',
            // isWrapped ? "items-start" : "items-center"
          )}
        >
          {isListed
            ? (
              <div className="flex items-center gap-2 flex-wrap">
               
                <Tippy
                  content="Connect your wallet first!"
                  className="shadow-lg"
                  disabled={Boolean(user)}
                >
                  <div>
                    <MainButton
                      onClick={handleBuy}
                      className={clsx("px-3", 
                      "w-24"
                      )}
                      noPadding
                      disabled={!handleCollect || purchasing || !user}
                    >
                      {purchasing
                        ? (
                          <span className="inline-block translate-y-0.5">
                            <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                          </span>
                        )
                        : "Collect"
                      }
                    </MainButton>
                  </div>
                </Tippy>
              </div>
            )
            : null
          }
          {isSold ? <p className='font-bold text-xl'>Sold {isMasterEdition ? " Out" : ""}!</p> : null}
        </div>
      </div>

    </div>
  )
}