import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import VideoPlayer from '../artDisplay/videoPlayer';
import debounce from 'lodash.debounce';

const ArtModule = ({ artModule, onEditArtModule, isOwner, submittedTokens, onDeleteModule, approvedArtists, handleCollect }) => {
  const breakpoint = useBreakpoints()  
  const isMobile = ["", "sm", "md"].includes(breakpoint)
  const isTablet = ["lg", "xl"].includes(breakpoint)
  const [editArtOpen, setEditArtOpen] = useState(false)

  const wrapperRef = useRef(null)
  const { isVisible } = useElementObserver(wrapperRef, "400px")

  const [wrapperWidth, setWrapperWidth] = useState(0)

  const gapSize = 24 //in pixels (must be inline styled so that row height calculations can take the exact number into account)

  useEffect(() => { 
    const getWrapperWidth = () => { 
      if(!wrapperRef.current) return
      const rowWidth = wrapperRef.current.offsetWidth
      setWrapperWidth(rowWidth)
    }

    getWrapperWidth()

    const debouncedGetWrapperWidth = debounce(getWrapperWidth, 200)

    window.addEventListener('resize', debouncedGetWrapperWidth)
    return () => {
      debouncedGetWrapperWidth.cancel()
      window.removeEventListener('resize', debouncedGetWrapperWidth)
    }
  }, [])
  
  const itemRows = useMemo(() => {
    if (!approvedArtists || !submittedTokens || !wrapperWidth) return []

    const tokenMints = artModule.tokens
  
    const useHalfRow = isTablet && tokenMints.length > 2
    const halfIndex = Math.floor(tokenMints.length / 2)
    const rows = useHalfRow
      ? [tokenMints.slice(0, halfIndex), tokenMints.slice(halfIndex)]
      : [tokenMints]
       

    return rows.map((tokenRow) => {
      
      const tokens = tokenRow.map(mint => submittedTokens.find(sT => sT.mint === mint)).filter(t => Boolean(t))
        // .map(t => {
        //   if (t.mint === "282cXKpE4oqMZEa7zWVQw2WroKiN5Nq7EfNYJNacWGip") {
        //     console.log(t)
        //     return {
        //       ...t,
        //       aspect_ratio: 1.3296296296
        //     }
        //   }
        //   return t
        // })

      const totalAspectRatio = tokens.reduce((acc, token) => acc + Number(token.aspect_ratio || 1), 0)
      const rowGapOffset = gapSize * (tokens.length - 1)
      const rowHeight = (wrapperWidth - rowGapOffset) / totalAspectRatio

      return tokens.map((token) => {
        const artist = approvedArtists.find(a => a.id === token.artist_id)
        const tokenWidth = isMobile ? wrapperWidth : (Number(token.aspect_ratio) * rowHeight)
        const tokenHeight = isMobile ? "100%" : rowHeight
        return (
          <ArtItem
            key={token.mint}
            token={token}
            artist={artist}
            handleCollect={handleCollect}
            height={tokenHeight}
            width={tokenWidth}
          />
        )
      })
    })
  }, [artModule.tokens, submittedTokens, approvedArtists, handleCollect, wrapperWidth, isMobile, isTablet])

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
              style={{gap: gapSize}} //gapSize must be coded so row height calculations can take them into account
              className={clsx("flex flex-col md:flex-row w-full mb-6")}
            >
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

export const ArtItem = ({ token, columns, artist, handleCollect, height, width, isMobile }) => {  
  const [user] = useContext(UserContext);

  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [purchasing, setPurchasing] = useState(false)

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
    //round up to bucket of 250 so we aren't caching too many sizes
    //then double for max perceivable quality (ends up with buckets of 500)
    return Math.ceil(width / 250) * 250 * 2
  }, [width])
  
  useEffect(() => {
    if (!token) return;
    if (token.animation_url) {
      if (token.animation_url.split(".").pop().split("ext=").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      } else {
        //TODO handle HTML and GLB
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
      className={clsx("relative duration-300 w-fit mx-auto",)}
    >
      <Link href={`/nft/${ token.mint }`} >
        <a  
          className={clsx(
            'w-fit relative block mx-auto duration-300 overflow-hidden shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg hover:-translate-y-2 active:translate-y-0'
          )}>
          {videoUrl ? (
            <VideoPlayer
              id={`video-player-${ token.mint }`}
              videoUrl={videoUrl}
              videoLoaded={videoLoaded}
              setVideoLoaded={setVideoLoaded}
              toggleMuteOnMouseOver
              controlsClass="group-hover/controls:translate-y-2 group-active/controls:translate-y-0"
              wrapperClass='w-full h-full rounded-lg'
              style={{
                height,
                maxWidth: width,
                maxHeight: "75vh"
              }}
            />
          ) : null}

          <CloudinaryImage
            token={token}
            style={{
              height,
              maxWidth: width,
            }}
            className={clsx(
              "object-cover duration-300",
              "max-h-[75vh]",
              videoLoaded && "hidden"
            )}
            width={cacheWidth}
            noLazyLoad
          />

        </a>
      </Link>
      <div
        className="w-full mt-4 px-4 mx-auto
          flex flex-wrap gap-x-6 gap-y-3 justify-between items-start"
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
          className={clsx(
            'flex flex-col gap-1',
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