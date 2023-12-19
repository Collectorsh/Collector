import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import useNftFiles, { getTokenAspectRatio } from '../../hooks/useNftFiles';
import { CATEGORIES } from '../FileDrop';
import HtmlViewer from '../artDisplay/htmlViewer';
import dynamic from 'next/dynamic';
import { Transition } from '@headlessui/react';

const ModelViewer = dynamic(() => import('../artDisplay/modelDisplay'), {
  ssr: false
});

const ArtModule = ({
  artModule,
  onEditArtModule,
  isOwner, 
  submittedTokens, 
  onDeleteModule, 
  approvedArtists, 
  handleCollect, 
  tokenMintsInUse, 
  curationType,
  curationId,
  setSubmittedTokens,
  owners
}) => {
  const breakpoint = useBreakpoints()  
  const isMobile = ["", "sm", "md"].includes(breakpoint)
  const isTablet = ["lg", "xl"].includes(breakpoint)
  const [editArtOpen, setEditArtOpen] = useState(false)

  const wrapperRef = useRef(null)

  const [wrapperWidth, setWrapperWidth] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)

  const gapSize = 24 //in pixels (must be inline styled so that row height calculations can take the exact number into account)
  const maxHeightRatio = 0.75 //in percentage of window height

  useEffect(() => { 
    const getDimensions = () => { 
      if(!wrapperRef.current) return
      const rowWidth = wrapperRef.current.offsetWidth
      setWrapperWidth(rowWidth)

      setMaxHeight(window.innerHeight * maxHeightRatio)
    }

    getDimensions()

    const debouncedGetDimensions = debounce(getDimensions, 250)

    window.addEventListener('resize', debouncedGetDimensions)
    return () => {
      debouncedGetDimensions.cancel()
      window.removeEventListener('resize', debouncedGetDimensions)
    }
  }, [])

  const { mappedTokens, mappedAspectRatios } = useMemo(() => { 
    //Map out tokens and aspect ratio
    const mappedTokens = {}
    const mappedAspectRatios = {}

    submittedTokens.forEach(token => { 
      const mint = token.mint;
      mappedAspectRatios[mint] = getTokenAspectRatio(token)
      mappedTokens[mint] = token
    })
    return {
      mappedTokens,
      mappedAspectRatios
    }
  }, [submittedTokens])


  const tokenRows = useMemo(() => { 
    if (!Object.values(mappedTokens).length) return []

    const tokenMints = artModule.tokens

    const tokens = tokenMints.map(mint => mappedTokens?.[mint]).filter(t => Boolean(t))

    const useHalfRow = isTablet && tokens.length > 2
    const halfIndex = Math.floor(tokens.length / 2)
    const rows =
      isMobile
        ? tokens.map(mint => [mint])
        : useHalfRow
          ? [tokens.slice(0, halfIndex), tokens.slice(halfIndex)]
          : [tokens]
    
    return rows
    
    // const fullTokens = rows.map(mints => mints.map(mint => mappedTokens?.[mint]))
    // const filteredTokens = fullTokens.map(tokens => tokens.filter(t => Boolean(t)))
    // return filteredTokens;
    
  }, [artModule.tokens, isMobile, isTablet, mappedTokens])

  const itemRows = useMemo(() => {
    if (!approvedArtists || !wrapperWidth || !tokenRows.length) return [];

    return tokenRows.map((tokens) => {
      const totalAspectRatio = tokens.reduce((acc, token) => {
        return acc + mappedAspectRatios[token.mint]
      }, 0)
      const rowGapOffset = gapSize * (tokens.length - 1)
      const rowHeight = Math.min((wrapperWidth - rowGapOffset) / totalAspectRatio, maxHeight)

      return tokens.map((token) => {
        const artist = approvedArtists.find(a => a.id === token.artist_id)
        const owner = owners?.find(o => o.id === token.owner_id)
        const tokenWidth = (mappedAspectRatios[token.mint] * rowHeight)
        const tokenHeight = rowHeight
        return (
          <ArtItem
            key={token.mint}
            token={token}
            artist={artist}
            handleCollect={handleCollect}
            height={tokenHeight}
            width={tokenWidth}
            curationType={curationType}
            owner={owner}
          />
        )
      })
    })
  }, [approvedArtists, handleCollect, mappedAspectRatios, tokenRows, wrapperWidth, maxHeight, curationType, owners])

  return (
    <div
      ref={wrapperRef}
      className={clsx("relative group w-full group/artRow min-h-[4rem] duration-300",
        // isVisible ? "opacity-100" : "opacity-0"
      )}
     
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
          <div className='absolute inset-0 w-full h-full flex justify-center items-center p-2'
            onClick={() => setEditArtOpen(true)}
          >
            <p>Click the gear icon in the top right to edit this Art Module</p>
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
            approvedArtists={approvedArtists}
            tokenMintsInUse={tokenMintsInUse}
            curationType={curationType}
            curationId={curationId}
            setSubmittedTokens={setSubmittedTokens}
          />
        )
        : null
      }
    </div>
  )
}

export default ArtModule;

export const ArtItem = ({ token, artist, handleCollect, height, width, curationType, owner }) => {  
  const [user] = useContext(UserContext);
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)

  const itemRef = useRef(null)
  const { isVisible } = useElementObserver(itemRef, "200px")

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [purchasing, setPurchasing] = useState(false)
  const [mediaType, setMediaType] = useState(CATEGORIES.IMAGE)
  const [lowMemory, setLowMemory] = useState(false)

  const disableLink = (mediaType !== "image") && !lowMemory

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
    return Math.ceil(width / 250) * 250 * 2;
  }, [width])

  useEffect(() => {
    if (htmlUrl) setMediaType(CATEGORIES.HTML)
    else if (vrUrl) setMediaType(CATEGORIES.VR)
    else if (videoUrl) setMediaType(CATEGORIES.VIDEO)
    else setMediaType(CATEGORIES.IMAGE)
  }, [videoUrl, htmlUrl, vrUrl, setMediaType])

  
  const handleBuy = async (e) => {
    if (!handleCollect || !user) return;

    setPurchasing(true)
    await handleCollect(token)
    setPurchasing(false)
  }
  const handleModelLoad = ({ lowMemory }) => {
    setLowMemory(lowMemory)
  }

  const userText = useMemo(() => { 
    if (curationType === "artist") {
      return (owner && owner.username !== artist?.username) ?
        <p>Owned by {owner.username}</p>
        : null
    } else {
      return artist ?
        <p>by {artist.username}</p>
        : null
    }
  },[curationType, artist, owner])
  
  return (
    <div
      ref={itemRef}
      className={clsx("relative duration-300 w-fit mx-auto",)}
    >
      <ToggleLink
        href={`/nft/${ token.mint }`}
        disabled={disableLink}
      >
        <a  
          disabled={disableLink}
          className={clsx(
            'w-fit relative block mx-auto duration-300 overflow-hidden shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg',
            "hover:-translate-y-2 active:translate-y-0",
            disableLink && "hover:translate-y-0",
          )}
          style={{
            height,
            width,
          }}
        >
          <Transition
            show={isVisible}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {vrUrl ? (
            <ModelViewer
              onLoad={handleModelLoad}
              allowUserLoading={false}
                vrUrl={vrUrl}
                style={{
                  height,
                  width,
                }}
                loading="lazy"
              />
            ) : null}

            {htmlUrl ? (
              <HtmlViewer
                htmlUrl={htmlUrl}
                style={{
                  height,
                  width,
                }}
                useLazyLoading
              />
            ): null}

            {videoUrl ? (
              <VideoPlayer
                id={`video-player-${ token.mint }`}
                videoUrl={videoUrl}
                videoLoaded={videoLoaded}
                setVideoLoaded={setVideoLoaded}
                // controlsClass="group-hover/controls:translate-y-2 group-active/controls:translate-y-0"
                // wrapperClass='w-full h-full rounded-lg group/controls'
              />
            ) : null}

            <CloudinaryImage
              useMetadataFallback
              token={token}
              className={clsx(
                "object-cover duration-300",
                "w-full h-full",
                (mediaType !== CATEGORIES.IMAGE) && "absolute inset-0"
              )}
              width={cacheWidth}
              noLazyLoad
            />

          </Transition>
  
        </a>
      </ToggleLink>
      <div
        className="w-full mt-4 px-4 mx-auto
          flex flex-wrap gap-x-6 gap-y-3 justify-between items-start"
        style={{
          maxWidth: width
        }}
      >
      
        <div
          className={clsx('flex gap-1', "flex-col items-start")}
        >
          <Link href={`/nft/${ token.mint }`} disabled={disableLink} passHref>
            <p
              className='font-bold text-2xl leading-8 truncate cursor-pointer'
              style={{
                maxWidth: width
              }}
              >
              {token.name}
            </p>
          </Link>

          {userText}

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
          {isSold ? <p className='font-bold text-xl leading-[32px]'>Sold {isMasterEdition ? " Out" : ""}!</p> : null}
        </div>
      </div>

    </div>
  )
}

const ToggleLink = ({ disabled, children, ...props }) => { 
  if (disabled) return <Fragment>{children}</Fragment>
  return <Link {...props}>{children}</Link>
}