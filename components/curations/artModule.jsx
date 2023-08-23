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
import recordSale from '../../data/salesHistory/recordSale';
import { shootConfetti } from '../../utils/confetti';
import { Oval } from 'react-loader-spinner';
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css";
import UserContext from '../../contexts/user';
import { error, success } from '../../utils/toast';

const ArtModule = ({ artModule, onEditArtModule, isOwner, submittedTokens, onDeleteModule, approvedArtists, handleBuyNowPurchase }) => {
  const breakpoint = useBreakpoints()  
  const [editArtOpen, setEditArtOpen] = useState(false)
  

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
      const artist = approvedArtists.find(a => a.id === token.artist_id)
      const totalWidthRatio = tokenRow.reduce((acc, token) => acc + token.aspect_ratio, 0)
      const widthPercent = (token.aspect_ratio / totalWidthRatio) * 100
      return (
        <ArtItem
          key={tokenMint}
          token={token}
          widthPercent={widthPercent}
          columns={cols}
          artist={artist}
          handleBuyNowPurchase={handleBuyNowPurchase}
        />
      )
    }))
  }, [artModule.tokens, breakpoint, submittedTokens, approvedArtists, handleBuyNowPurchase])

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

export const ArtItem = ({ token, columns, widthPercent, artist, handleBuyNowPurchase }) => {  
  const [loaded, setLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [purchasing, setPurchasing] = useState(false)
  const videoRef = useRef(null);

  const [user] = useContext(UserContext);

  const { isVisible } = useElementObserver(videoRef, "500px")  

  const isListed = token.listed_status === "listed"
  const isSold = token.listed_status === "sold"

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
    if (!handleBuyNowPurchase || !user) return;

    setPurchasing(true)
    
    const txHash = await handleBuyNowPurchase(token.listing_receipt)

    const res = await recordSale({
      apiKey: user.api_key,
      curationId: token.curation_id,
      token: token,
      buyerId: user.id,
      buyerAddress: user.public_keys[0],
      saleType: "buy_now",
      txHash: txHash,
    })

    if (res?.status === "success") {
      success(`Congrats! ${ token.name } has been collected!`)
      shootConfetti(3)
    } else {
      error(`Error buying ${ token.name }: ${ res?.message }`)
    }
    setPurchasing(false)
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
            mint={token.mint}
            metadata={token}
            useUploadFallback
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
      <div className="w-full mt-4 px-4 mx-auto
      flex flex-wrap gap-3 justify-between items-center"
      >
        <div className='flex flex-col items-start gap-1'>
          <p className='font-bold text-lg'>{token.name} </p>
          {artist ? (
            <p>by {artist.username}</p>
          ) : null}
        </div>
        {isListed //&& token.buy_now_price
          ? (
            <div className="flex items-center gap-2 flex-wrap">
              <p className='font-bold text-lg'>{roundToPrecision(token.buy_now_price, 2)}◎</p>
              <Tippy
                content="Connect your wallet first!"
                className="shadow-lg"
                disabled={Boolean(user)}
              >
                <div>
                  <MainButton
                    onClick={handleBuy}
                    className="px-3 w-28"
                    noPadding
                    disabled={!handleBuyNowPurchase || purchasing || !user}
                  >
                    {purchasing
                      ? (
                        <span className="inline-block translate-y-0.5">
                          <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                        </span>
                      )
                      : "Buy Now"
                    }
                  </MainButton>
                </div>
              </Tippy>
            </div>
          )
          : null
        }
        {isSold ? <p className='font-bold text-lg'>Sold!</p> : null}
      </div>

    </div>
  )
}