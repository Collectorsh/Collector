import ContentLoader from "react-content-loader";
import NotFound from "../../components/404";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation"
import getTokenByMint, { useTokenByMint } from "../../data/nft/getTokenByMint";
import { nullifyUndefinedArr, nullifyUndefinedObj } from "../../utils/nullifyUndefined";
import { useEffect, useRef, useState } from "react";
import { truncate } from "../../utils/truncate";
import { useRouter } from "next/router";
import getCurationsByListingMint from "../../data/curation/getCurationsByListingMint";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import ArtModal from "../../components/detail/artModal";
import DetailListings from "../../components/detail/listings";
import Link from "next/link";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import { getImageSize } from "react-image-size";
import { SpeakerphoneIcon } from "@heroicons/react/outline";

export default function DetailPage({token, curations}) {
  // return <NotFound />
  // const router = useRouter();
  // const { mint } = router.query;
  // const token = useTokenByMint(mint);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageWidth, setImageWidth] = useState("70vw");
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const isMasterEdition = token?.is_master_edition
  const isEdition = token?.is_edition
  const supply = token?.supply
  const maxSupply = token?.max_supply
  const editionNumber = token?.edition_number

  const artistName = token?.artist_name ? token.artist_name.replace("_", " ") : truncate(token?.creator, 4)
  const ownerName = token?.owner_name ? token.owner_name.replace("_", " ") : truncate(token?.owner, 4)
  const supplyText = isMasterEdition
    ? `${ maxSupply - supply }/${ maxSupply } Editions Available`
    : isEdition
      ? `Edition #${ editionNumber } ${maxSupply ? ` of ${ maxSupply }` :""}`
      : "1 of 1"
  const solscanUrl = token?.mint ? `https://solscan.io/token/${ token?.mint }` : ""


  const activeCurations = curations?.filter(curation => {
    return curation.submitted_token_listings?.find(l => {
      const isToken = l.mint === token.mint
      const isListed = l.listed_status === "listed"
      return isToken && isListed
    })
  })
  
  useEffect(() => {
    if(!imgLoaded) return;
    const getImageSize = () => {
      if (!imageRef.current) return;
      const width = imageRef.current.clientWidth
      setImageWidth(`${width}px`);
    }
    getImageSize();
    window.addEventListener("resize", getImageSize);
    return () => window.removeEventListener("resize", getImageSize);
  }, [imgLoaded])

   useEffect(() => {
    if (!videoRef.current) return;
     if (videoLoaded) {
       videoRef.current.play()
       videoRef.current.muted = false
     }
  }, [videoLoaded])

  useEffect(() => {
    if (!token) return;
    if (token.animation_url) {
      if (token.animation_url.split(".").pop().split("ext=").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      }
    }
  }, [token]);

  const expandImage = () => setImageExpanded(!imageExpanded)
  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    setIsMuted(prev => {
      videoRef.current.muted = !prev
      return !prev
    })
  }

  return (
    <>
      <MainNavigation />
      <ArtModal isOpen={imageExpanded} onClose={() => setImageExpanded(false)} token={token} />
      <div className={clsx("max-w-screen-2xl mx-auto w-full px-2 py-5 duration-200", imgLoaded ? "opacity-100" : "opacity-0")}>
          {!imgLoaded ? (
              <ContentLoader
                speed={2}
                className={`mx-auto w-[70vw] h-[75vh] rounded-xl`}
                backgroundColor="rgba(120,120,120,0.2)"
                foregroundColor="rgba(120,120,120,0.1)"
              >
                <rect className="w-full h-full" />
              </ContentLoader>
            
          ) : null}
        <div
          className="relative shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg overflow-hidden w-fit h-fit mx-auto group"
        >
          <button
            onClick={expandImage}
            className={clsx("absolute z-[15] right-5 top-5 p-0.5",
              "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
              "duration-300",
              "md:opacity-50 hover:opacity-100 group-hover:opacity-100",
              "hover:scale-110 active:scale-100",
            )}
          >
            <ArrowsExpandIcon className="w-7 h-7" />
          </button>
          {videoUrl && imgLoaded ? (
            <>
              <video
                autoPlay
                ref={videoRef}
                preload="metadata"
                muted
                loop
                playsInline
                id={`video-${ token.mint }`}
                className="w-full h-full object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
                onCanPlayThrough={e => {
                  e.target.classList.add("opacity-100")
                  setVideoLoaded(true)
                }}
                onError={(e) => e.target.classList.add("hidden")}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <MuteButton
                onClick={handleMuteToggle}
                isMuted={isMuted}
                iconClassName="w-7 h-7"
              />
                
            </>
          ) : null}

          <CloudinaryImage
            imageRef={imageRef}
            className="max-h-[75vh]"
            token={token}
            useUploadFallback
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div
          className="mt-3 px-4 mx-auto"
          style={{ maxWidth: imageWidth }}
        >
          <div className="flex flex-col gap-1">
            <h1 className="collector text-4xl">{token?.name}</h1>
            {artistName
              ? <p>by {artistName}</p>
              : null
            }
            <p className=''>{supplyText}</p>
            {!isMasterEdition
              ? <p className="">Owned by {ownerName}</p>
              : null
            }
          </div>
        
          <p className="text-xs my-4 whitespace-pre-wrap">{token?.description}</p>
          {activeCurations.length > 0
            ? (
              <div className="my-4">
                <hr className="border-neutral-200 dark:border-neutral-800" />
                <h2 className="text-lg mt-5 mb-2 ">Listings</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeCurations?.map(curation => (
                    <DetailListings key={token.mint} curation={curation} mint={token.mint} />
                  ))}
                </div>

              
              </div>
            )
            : null
          }
          <hr className="border-neutral-200 dark:border-neutral-800" />
          
          <div className="flex flex-wrap gap-x-4 mt-4">
            <span className="font-bold">Mint Address: </span>
            <a className="block hover:scale-105 duration-300 w-fit" href={solscanUrl}>
              {truncate(token?.mint)}
            </a>
          </div>

          <div className="flex flex-wrap gap-x-4 mt-2">
            <p className="font-bold ">Creators: </p>
            {token.creators?.map(creator => (
              <AddressLink key={creator.address} address={creator.address} />
            ))}
          </div>      
        </div>
      </div>
    </>
  )
}

const AddressLink = ({ address}) => { 
  const solscanUrl = address ? `https://solscan.io/account/${ address }` : ""
  return (
    <a className="block hover:scale-105 duration-300 w-fit" href={solscanUrl}>
      {truncate(address, 4)}
    </a>
  )
}

export async function getServerSideProps(context) {
  const mint = context.params.mint;

  const baseCurations = await getCurationsByListingMint(mint)
    .then(res => res?.curations);

  const curations = nullifyUndefinedArr(baseCurations);

  const baseToken = await getTokenByMint(mint);
  const token = nullifyUndefinedObj(baseToken);
  return { props: { token, curations } };
}

export const MuteButton = ({ isMuted, onClick, className, iconClassName }) => { 
  return (
    <button
      onClick={onClick}
      className={clsx("absolute z-[15] right-5 bottom-5 p-0.5",
        "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
        "duration-300",
        "md:opacity-50 hover:opacity-100 group-hover:opacity-100",
        "hover:scale-110 active:scale-100",
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