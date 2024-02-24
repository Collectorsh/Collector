import { Fragment, useContext, useEffect, useMemo, useRef, useState } from "react";
import UserContext from "../../contexts/user";
import useNftFiles from "../../hooks/useNftFiles";
import useElementObserver from "../../hooks/useElementObserver";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import HtmlViewer from "../artDisplay/htmlViewer";
import VideoPlayer from "../artDisplay/videoPlayer";
import Link from "next/link";
import { roundToPrecision } from "../../utils/maths";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import MainButton from "../MainButton";
import dynamic from 'next/dynamic';
import { Oval } from "react-loader-spinner";
import { CATEGORIES } from "../FileDrop";
import CloudinaryImage from "../CloudinaryImage";
import getListingsByParent from "../../data/curationListings/getListingsByParent";
import { EditionListing } from "../detail/secondaryEditionListings";
import * as Icon from "react-feather";
import { displayName } from "../../utils/displayName";

const ModelViewer = dynamic(() => import('../artDisplay/modelDisplay'), {
  ssr: false
});

const ArtItem = ({ token, artist, handleCollect, height, width, curationType, owner }) => {
  const [user] = useContext(UserContext);
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)

  const itemRef = useRef(null)

  const [lazyLoadBuffer, setLazyLoadBuffer] = useState("500px")

  const { isVisible } = useElementObserver(itemRef, lazyLoadBuffer)

  const [purchasing, setPurchasing] = useState(false)
  const [mediaType, setMediaType] = useState(CATEGORIES.IMAGE)
  const [lowMemory, setLowMemory] = useState(false)
  const [editionListings, setEditionListings] = useState(null);

  const disableLink = (mediaType !== "image") && !lowMemory

  const isMasterEdition = token.is_master_edition
  const isEdition = token.is_edition
  const listedEditionCount = editionListings?.length
  const maxSupply = token.max_supply
  const supply = token.supply

  const isListed = token.listed_status === "listed"
  const isSold = token.listed_status === "sold" || isMasterEdition && supply >= maxSupply

  
  const artistName = displayName(artist) || token.temp_artist_name
  
  const sellingSecondaryFromMaster = isMasterEdition && (!isListed || isSold) && Boolean(editionListings?.length)
  
  const price = sellingSecondaryFromMaster
    ? editionListings?.[0].buy_now_price
    : token.buy_now_price
  
  const noPrice = price === null || price === undefined
  const displayBuyNowPrice = !noPrice && (isListed || isSold || sellingSecondaryFromMaster)

  const supplyText = useMemo(() => {
    // if (curationType == "collector" && (!isListed && !isSold)) return ""

    const secEdCount = listedEditionCount ? `${ listedEditionCount }` : ""
    if (sellingSecondaryFromMaster) return `${ secEdCount }/${ maxSupply } Secondary Editions`

    if (isMasterEdition) return `${ maxSupply - supply }/${ maxSupply } Editions`
    if (isEdition) return "Edition";
    return "1 of 1"
  }, [isMasterEdition, supply, maxSupply, isEdition, listedEditionCount, sellingSecondaryFromMaster])

  const cacheWidth = useMemo(() => {
    //round up to bucket of 250 so we aren't caching too many sizes
    //then double for max perceivable quality (ends up with buckets of 500)
    return Math.ceil(width / 250) * 250 * 2;
  }, [width])

  useEffect(() => {
    if (!isMasterEdition) return;

    (async () => {
      const res = await getListingsByParent(token.mint)

      if (res?.status !== "success") {
        console.log("Error getting listings by parent", res?.msg || res?.error)
        return;
      } else {
        const editionListings = res.listings.sort((a, b) => Number(a.buy_now_price) - Number(b.buy_now_price))
        setEditionListings(editionListings)
      }
    })();

  }, [token, isMasterEdition])

  useEffect(() => {
    //check screen hieght and set lazy load buffer to screen height
    const windowHeight = window.innerHeight
    setLazyLoadBuffer(`${ windowHeight/2 }px`)
  }, [])

  useEffect(() => {
    if (htmlUrl) setMediaType(CATEGORIES.HTML)
    else if (vrUrl) setMediaType(CATEGORIES.VR)
    else if (videoUrl) setMediaType(CATEGORIES.VIDEO)
    else setMediaType(CATEGORIES.IMAGE)
  }, [videoUrl, htmlUrl, vrUrl, setMediaType])

  const userText = useMemo(() => {
    if (curationType === "artist") {
      const useOwnerLink = owner && owner.subscription_level === "pro" && owner.username

      return (owner?.username && owner.username !== artist?.username) ? (
        <ToggleLink
          disabled={!useOwnerLink}  
          href={`/gallery/${ owner?.username }`}
          passHref
        > 
          <p className={clsx(useOwnerLink && "relative -left-2 rounded-md px-2 py-0 hoverPalette1 cursor-pointer")}>Owned by {displayName(owner)}</p>
        </ToggleLink>
      )
        : null
    } else if (artistName) {
      const useArtistLink = artist && artist.subscription_level === "pro" && artist.username
      return (
        <ToggleLink
          disabled={!useArtistLink}
          href={`/gallery/${ artist?.username }`}
          passHref
        >
          <p className={clsx(useArtistLink && "relative -left-2 rounded-md px-2 py-0 hoverPalette1 cursor-pointer")}> by {artistName}</p>
        </ToggleLink>
      )
    }
  }, [curationType, artistName, artist, owner])

  const secondaryListingInfo = sellingSecondaryFromMaster
    ? (
      <Tippy
        content="Editions are sold lowest price first"
      >
        <Icon.Info size={14} className="inline opacity-50" />
      </Tippy>
    )
    : null

  const handleBuy = async (e) => {
    if (!handleCollect || !user) return;

    setPurchasing(true)
    await handleCollect(token)
    setPurchasing(false)
  }
  const handleModelLoad = ({ lowMemory }) => {
    setLowMemory(lowMemory)
  }

  const handleCollectSecEd = (mint) => {
    setEditionListings(prev => {
      const newEditionListings = prev.filter(l => l.mint !== mint)
      return newEditionListings
    })
  }



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
            'w-fit relative block mx-auto duration-300 overflow-hidden shadow-md rounded-lg',
            "hover:-translate-y-2 active:translate-y-0",
            "bg-zinc-200 dark:bg-zinc-800",
            disableLink && "hover:translate-y-0",
          )}
          style={{
            height,
            width,
          }}
        >
          <Transition
            show={isVisible}
            enter="transition-opacity duration-700"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-700"
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
            ) : null}

            {videoUrl ? (
              <VideoPlayer
                videoUrl={videoUrl}
                token={token}
                cacheWidth={cacheWidth}
              />
            ) : null}

            <CloudinaryImage
              useMetadataFallback
              useUploadFallback
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
        className="w-full mt-1 px-4 mx-auto
          flex flex-wrap gap-x-6 gap-y-3 justify-between items-center"
        style={{
          maxWidth: width
        }}
      >
        <div
          className={clsx('flex gap-1', "flex-col items-start relative")}
        >

          <p className='textPalette2 font-bold text-sm mt-1 flex gap-1'>{supplyText}{secondaryListingInfo}</p>

      
          <Link href={`/nft/${ token.mint }`} disabled={disableLink} passHref>
            <p
              className='font-bold text-2xl leading-7 truncate cursor-pointer px-2 relative -left-2 hoverPalette1 rounded-md'
              style={{
                maxWidth: width
              }}
            >
              {token.name}
            </p>
          </Link>

          {userText}
        </div>
        <div>
          {(isListed || isSold)
            ? (
              
                <Tippy
                  content="Connect your wallet first!"
                  className="shadow-lg"
                  disabled={Boolean(user)}
                >
                  <div>
                    <MainButton
                      onClick={handleBuy}
                      className="min-w-[10rem] mt-1.5"
                      disabled={!handleCollect || purchasing || !user || isSold}
                      size="lg"
                      solid
                    >
                      {purchasing
                        ? (
                          <span className="inline-block translate-y-0.5">
                            <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={4} className="translate-y-0.5"/>
                          </span>
                        )
                        : isSold
                          ? <p>Sold{isMasterEdition ? " Out" : ""} {roundToPrecision(price, 2)}◎</p>
                          : <p>Collect {roundToPrecision(price, 2) }◎</p>
                      }
               
                    </MainButton>
                  </div>
                </Tippy>
             
            )
            : null
          }

          {sellingSecondaryFromMaster
            ? <EditionListing listing={editionListings[0]} onCollect={handleCollectSecEd} />
            : null
          }
        </div>
      </div>

    </div>
  )
}

export default ArtItem

export const ToggleLink = ({ disabled, children, ...props }) => {
  if (disabled) return <Fragment>{children}</Fragment>
  return <Link {...props}>{children}</Link>
}