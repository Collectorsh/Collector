import ContentLoader from "react-content-loader";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation"
import getTokenByMint, { useTokenByMint } from "../../data/nft/getTokenByMint";
import { nullifyUndefinedArr, nullifyUndefinedObj } from "../../utils/nullifyUndefined";
import { useEffect, useRef, useState } from "react";
import { truncate } from "../../utils/truncate";
import getCurationsByListingMint from "../../data/curation/getCurationsByListingMint";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import ArtModal from "../../components/detail/artModal";
import DetailListings from "../../components/detail/listings";
import VideoPlayer from "../../components/artDisplay/videoPlayer";
import useNftFiles, { altFileAspectRatio } from "../../hooks/useNftFiles";
import HtmlViewer from "../../components/artDisplay/htmlViewer";

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import("../../components/artDisplay/modelDisplay"), {
  ssr: false
});

export default function DetailPage({token, curations}) {
  const {videoUrl, htmlUrl, vrUrl} = useNftFiles(token)

  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [assetWidth, setAssetWidth] = useState("70vw");
  const imageRef = useRef(null);

  const isMasterEdition = token?.is_master_edition
  const isEdition = token?.is_edition
  const supply = token?.supply
  const maxSupply = token?.max_supply
  const editionNumber = token?.edition_number

  const useAltMediaAspectRatio = Boolean(htmlUrl || vrUrl)
  const altAssetHeight = (useAltMediaAspectRatio && typeof assetWidth === "number")
    ? assetWidth * altFileAspectRatio
    : assetWidth
  
  const artistName = token?.artist_name ? token.artist_name.replace("_", " ") : truncate(token?.artist_address, 4)
  const ownerName = token?.owner_name ? token.owner_name.replace("_", " ") : truncate(token?.owner_address, 4)

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
    if(!imgLoaded && !useAltMediaAspectRatio) return;
    const getAssetSize = () => {
      if (useAltMediaAspectRatio) {
        //set width to max-height
        const width = Math.min(window.innerHeight * 0.75, window.innerWidth * 0.9)
        setAssetWidth(width)
      } else {
        if (!imageRef.current) return;
        const width = imageRef.current.clientWidth
        setAssetWidth(width);
      }
    }
    getAssetSize();
    window.addEventListener("resize", getAssetSize);
    return () => window.removeEventListener("resize", getAssetSize);
  }, [imgLoaded, videoUrl, useAltMediaAspectRatio])

  const expandImage = () => setImageExpanded(!imageExpanded)


  //TODO, figure out how to handle videos with width larger than the window 
  //or that would mess up the aspect ratio when constraining the height
  //add "|| videoUrl" back to the getImageSize useEffect condition 
  const handleRefWidthChange = (width) => { 
    setAssetWidth(`${ width }px`)
  }

  return (
    <>
      <MainNavigation />
      <ArtModal isOpen={imageExpanded} onClose={() => setImageExpanded(false)} token={token} />
      <div className={clsx(
        "max-w-screen-2xl mx-auto w-full px-2 py-5 duration-300",
        imgLoaded || useAltMediaAspectRatio ? "opacity-100" : "opacity-0"
      )}>
         
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

         
          <div className={clsx((useAltMediaAspectRatio && !imageExpanded) ? "relative" : "hidden")}
              style={{
                width: assetWidth,
                height: altAssetHeight
              }}>
              {(vrUrl) ? (
                <ModelViewer
                  vrUrl={vrUrl}
                />  
              ): null}
              
              {(htmlUrl) ? (
                <HtmlViewer
                  htmlUrl={htmlUrl}
                />
              ) : null}
            </div>
        

          
          {(videoUrl && !imageExpanded) ? (
            <VideoPlayer
              handleRefWidthChange={handleRefWidthChange}
              id={`video-player-${ token.mint }`}
              videoUrl={videoUrl}
              videoLoaded={videoLoaded}
              setVideoLoaded={setVideoLoaded}
            />
          ) : null}

          <CloudinaryImage
            imageRef={imageRef}
            className={clsx("max-h-[75vh] w-full",
              videoLoaded && "invisible",
              // useAltMediaAspectRatio && "hidden" 
              useAltMediaAspectRatio && "absolute inset-0 object-contain"
            )}
            token={token}
            useUploadFallback
            useMetadataFallback
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div
          className="mt-3 px-4 mx-auto"
          style={{ maxWidth: assetWidth }}
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
                    <DetailListings key={token.mint+curation.name} curation={curation} mint={token.mint} />
                  ))}
                </div>

              
              </div>
            )
            : null
          }
          <hr className="border-neutral-200 dark:border-neutral-800" />
          
          <div className="flex flex-wrap gap-x-4 mt-4">
            <span className="font-bold">Mint Address: </span>
            <a className="block hover:scale-105 duration-300 w-fit" href={solscanUrl} target="_blank" rel="noreferrer">
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
    <a className="block hover:scale-105 duration-300 w-fit" href={solscanUrl} target="_blank" rel="noreferrer">
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

