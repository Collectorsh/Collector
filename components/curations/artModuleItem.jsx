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
import { InformationCircleIcon } from "@heroicons/react/solid";
import { EditionListing } from "../detail/secondaryEditionListings";

const ModelViewer = dynamic(() => import('../artDisplay/modelDisplay'), {
  ssr: false
});

const ArtItem = ({ token, artist, handleCollect, height, width, curationType, owner }) => {
  const [user] = useContext(UserContext);
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)

  const itemRef = useRef(null)

  const [lazyLoadBuffer, setLazyLoadBuffer] = useState("1000px")

  const { isVisible } = useElementObserver(itemRef, lazyLoadBuffer)

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [purchasing, setPurchasing] = useState(false)
  const [mediaType, setMediaType] = useState(CATEGORIES.IMAGE)
  const [lowMemory, setLowMemory] = useState(false)
  const [editionListings, setEditionListings] = useState(null);

  const disableLink = (mediaType !== "image") && !lowMemory

  const isMasterEdition = token.is_master_edition
  const isEdition = token.is_edition
  const listedEditionCount = editionListings?.length
  const maxSupply = token.max_supply
  const supply = maxSupply//token.supply

  const isListed = token.listed_status === "listed"
  const isSold = token.listed_status === "sold" || isMasterEdition && supply >= maxSupply

  
  const artistName = artist?.username || token.temp_artist_name
  
  const sellingSecondaryFromMaster = isMasterEdition && (!isListed || isSold) && editionListings?.length
  
  const price = sellingSecondaryFromMaster
  ? editionListings?.[0].buy_now_price
  : token.buy_now_price
  
  const displayBuyNowPrice = price !== undefined && (isListed || isSold || sellingSecondaryFromMaster)

  const supplyText = useMemo(() => {
    if (curationType == "collector" && (!isListed && !isSold)) return ""

    const secEdCount = listedEditionCount ? `${ listedEditionCount }` : ""
    if (sellingSecondaryFromMaster) return `${ secEdCount }/${ maxSupply } Secondary Editions`

    if (isMasterEdition) return `${ maxSupply - supply }/${ maxSupply } Editions`
    if (isEdition) return "Secondary Edition";
    return "1 of 1"
  }, [isMasterEdition, supply, maxSupply, isEdition, curationType, isListed, listedEditionCount, isSold, sellingSecondaryFromMaster])

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
        console.log("🚀 ~ file: artModuleItem.jsx:92 ~ editionListings:", editionListings)
        setEditionListings(editionListings)
      }
    })();

  }, [token, isMasterEdition])

  useEffect(() => {
    //check screen hieght and set lazy load buffer to screen height
    const windowHeight = window.innerHeight
    setLazyLoadBuffer(`${ windowHeight }px`)
  }, [])

  useEffect(() => {
    if (htmlUrl) setMediaType(CATEGORIES.HTML)
    else if (vrUrl) setMediaType(CATEGORIES.VR)
    else if (videoUrl) setMediaType(CATEGORIES.VIDEO)
    else setMediaType(CATEGORIES.IMAGE)
  }, [videoUrl, htmlUrl, vrUrl, setMediaType])

  const userText = useMemo(() => {
    if (curationType === "artist") {
      return (owner && owner.username !== artistName) ?
        <p>Owned by {owner.username}</p>
        : null
    } else if (artistName) {
      return <p>by {artistName}</p>
    }
  }, [curationType, artistName, owner])

  const secondaryListingInfo = sellingSecondaryFromMaster
    ? (
      <Tippy
        content="Editions are sold lowest price first"
        className="shadow-lg"
      >
        <InformationCircleIcon className="w-4 inline -mt-2" />
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
                setVideoLoaded={setVideoLoaded}

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
            {(displayBuyNowPrice || sellingSecondaryFromMaster)
              ? <>
                <p className=''>{roundToPrecision(price, 2)}◎</p>
                <span>-</span>
              </>
              : null
            }
            <span className=''>{supplyText}{secondaryListingInfo}</span>
          </div>
        </div>
        <div
          className={clsx(
            'flex flex-col gap-1',
          )}
        >
          {(isListed && !sellingSecondaryFromMaster && !isSold)
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
                      disabled={!handleCollect || purchasing || !user || isSold}
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

          {sellingSecondaryFromMaster
          ? <EditionListing listing={editionListings[0]} onCollect={handleCollectSecEd} />
          : null
      }
          {isSold && !sellingSecondaryFromMaster ? <p className='font-bold text-xl leading-[32px]'>Sold {isMasterEdition ? " Out" : ""}!</p> : null}
        </div>
      </div>

    </div>
  )
}

export default ArtItem

const ToggleLink = ({ disabled, children, ...props }) => {
  if (disabled) return <Fragment>{children}</Fragment>
  return <Link {...props}>{children}</Link>
}