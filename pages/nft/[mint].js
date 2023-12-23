import ContentLoader from "react-content-loader";
import CloudinaryImage from "../../components/CloudinaryImage";
import MainNavigation from "../../components/navigation/MainNavigation"
import getTokenByMint, { useTokenByMint } from "../../data/nft/getTokenByMint";
import { nullifyUndefinedArr, nullifyUndefinedObj } from "../../utils/nullifyUndefined";
import { useContext, useEffect, useRef, useState } from "react";
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
import Drawer from "../../components/Drawer";
import { parseExternalLink } from "../../utils/parseExternalLink";
import MainButton from "../../components/MainButton";
import { UpdateMetadata } from "../../data/nft/updateMetadata";
import { Oval } from "react-loader-spinner";
import { error, success } from "../../utils/toast";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import UserContext from "../../contexts/user";
import { adminIDs } from "../../config/settings";
import debounce from "lodash.debounce";

const ModelViewer = dynamic(() => import("../../components/artDisplay/modelDisplay"), {
  ssr: false
});

export default function DetailPage({token, curations}) {
  const { videoUrl, htmlUrl, vrUrl } = useNftFiles(token)
  
  const [user] = useContext(UserContext);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [assetWidth, setAssetWidth] = useState(786);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [videoAspectRatio, setVideoAspectRatio] = useState(1);
  const [maxHeight, setMaxHeight] = useState(0);
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);

  const isAdmin = adminIDs.includes(user?.id)
  const userIsArtist = token.creators?.some(creator => user?.public_keys.includes(creator.address))
  const showUpdateButton = isAdmin || userIsArtist

  const isMasterEdition = token?.is_master_edition
  const isEdition = token?.is_edition
  const supply = token?.supply
  const maxSupply = token?.max_supply
  const editionNumber = token?.edition_number



  const externalUrl = token.externalUrl
    ? parseExternalLink(token.externalUrl)
    : null

  const useAltMediaAspectRatio = Boolean(htmlUrl || vrUrl)
  const altAssetHeight = (useAltMediaAspectRatio && typeof assetWidth === "number")
    ? assetWidth / altFileAspectRatio
    : assetWidth / videoAspectRatio
  
  const artistName = token?.artist_name ? token.artist_name.replace("_", " ") : truncate(token?.artist_address, 4)
  const ownerName = token?.owner_name ? token.owner_name.replace("_", " ") : truncate(token?.owner_address, 4)

  const supplyText = isMasterEdition
    ? `${ maxSupply - supply }/${ maxSupply } Editions Available`
    : isEdition
      ? `Edition #${ editionNumber } ${maxSupply ? ` of ${ maxSupply }` :""}`
      : "1 of 1"
  
  const solscanUrl = token?.mint ? `https://solscan.io/token/${ token?.mint }` : ""

  const showDetails = (imgLoaded || useAltMediaAspectRatio || videoLoaded)

  const activeCurations = curations?.filter(curation => {
    return curation.submitted_token_listings?.find(l => {
      const isToken = l.mint === token.mint
      const isListed = l.listed_status === "listed"
      return isToken && isListed
    })
  })

  useEffect(() => { 
    const getDimensions = () => { 
      if(!wrapperRef.current) return;
      setWrapperWidth(wrapperRef.current.offsetWidth - 16)
      setMaxHeight(window.innerHeight * 0.75)
    }
    getDimensions();
    const debouncedGetDimensions = debounce(getDimensions, 250)
    window.addEventListener("resize", debouncedGetDimensions);
    return () => window.removeEventListener("resize", debouncedGetDimensions);
  }, [wrapperRef])
  
  useEffect(() => {
    if(!imgLoaded && !useAltMediaAspectRatio) return;
    const getAssetSize = () => {
      if (useAltMediaAspectRatio && wrapperWidth) {
        //set width to max-height
        const height = Math.min(wrapperWidth / altFileAspectRatio, maxHeight)
        const width = height * altFileAspectRatio;
        // const width = Math.min(maxHeight, window.innerWidth * 0.9)
        setAssetWidth(width)
      } else if (videoUrl && wrapperWidth) {
        //max height is window height * 0.75;
        const height = Math.min(wrapperWidth / videoAspectRatio, maxHeight)
        const width = height * videoAspectRatio;
        setAssetWidth(width);
      } else {
        if (!imageRef.current) return;
        const width = imageRef.current.clientWidth
        setAssetWidth(width);
      }
    }
    getAssetSize();
    const debouncedGetAssetSize = debounce(getAssetSize, 250)
    window.addEventListener("resize", debouncedGetAssetSize);

    return () => window.removeEventListener("resize", debouncedGetAssetSize);
  }, [imgLoaded, videoUrl, useAltMediaAspectRatio, wrapperWidth, videoAspectRatio, maxHeight])

  const expandImage = () => setImageExpanded(!imageExpanded)


  const handleUpdateMetadata = async () => { 
    setUpdating(true)
    const updatedToken = await UpdateMetadata(token.mint)
    if (updatedToken) {
      success("Metadata Updated")
    } else {
      error("Error updating metadata")
    }
    setUpdating(false)
  }

  return (
    <>
      <Toaster />
      <MainNavigation />
      <ArtModal
        isOpen={imageExpanded}
        onClose={() => setImageExpanded(false)}
        token={token}
      />

      {!showDetails ? (
        <div className="absolute w-full h-screen">
          <h1 className="animate-pulse font-bold text-4xl text-center mt-10">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
        </div>
      ) : null}

      <div
        ref={wrapperRef}
        className={clsx(
          "max-w-screen-md mx-auto w-full px-2 py-5 duration-300",
          showDetails ? "opacity-100" : "opacity-0"
      )}>
         
        <div
          className={clsx(
            "relative shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg overflow-hidden mx-auto group w-fit max-w-full max-h-[75vh]",
            showDetails ? "h-fit" : "h-screen",
          )}
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

          <CloudinaryImage
            imageRef={imageRef}
            className={clsx("max-h-[75vh] w-full h-full object-contain",
              videoLoaded && "hidden",
              (useAltMediaAspectRatio || videoUrl) && "absolute inset-0 object-contain z-0"
            )}
            token={token}
            useUploadFallback
            useMetadataFallback
            onLoad={() => setImgLoaded(true)}
          />

          <div
            className={clsx((useAltMediaAspectRatio || videoUrl) ? "relative max-w-full max-h-fit z-10 duration-300" : "hidden")}
            style={{
              width: assetWidth,
              height: altAssetHeight
            }}
          >
            {!imageExpanded ? (
              <>
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

                {(videoUrl) ? (
                  <VideoPlayer
                    id={`video-player-${ token.mint }`}
                    videoUrl={videoUrl}
                    videoLoaded={videoLoaded}
                    setVideoLoaded={setVideoLoaded}
                    token={token}
                    getAspectRatio={setVideoAspectRatio}
                    wrapperClass={clsx("w-full duration-100 z-20")}
                    // style={{
                    //   width: assetWidth,
                    //   maxHeight: altAssetHeight
                    // }}
                  />
                ) : null}
              </>
            ) : null}
          </div>      
        </div>

        <div
          className={clsx("mt-3 px-4 mx-auto")}
        >
          <div className="flex justify-between items-center">
            <h1 className="collector text-4xl mb-2">{token?.name}</h1>
            
            {showUpdateButton ? (
              <MainButton
                noPadding className="px-2 py-0 w-44 flex justify-center items-center"
                onClick={handleUpdateMetadata}
                disabled={updating}
              >
                {updating ? (
                  <Oval color="#FFF" secondaryColor="#666" height={26} width={26} />
                ): "Refresh Metadata"}
              </MainButton>
            ) : null}
          </div>

          <div className="flex gap-1">
            {artistName
              ? <p> by {artistName}</p>
              : null
            }
            {(!isMasterEdition && ownerName !== artistName)
              ? <p className="">- owned by {ownerName}</p>
              : null
            }
          </div>
          <p className='mt-2'>{supplyText}</p>
        
          <p className="text-xs my-4 whitespace-pre-wrap">{token?.description}</p>
          {activeCurations.length > 0
            ? (
              <div className="my-4">
                <hr className="border-neutral-200 dark:border-neutral-800" />
                <h2 className="font-bold mt-5 mb-2 ">Listings:</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeCurations?.map(curation => (
                    <DetailListings key={token.mint+curation.name} curation={curation} mint={token.mint} />
                  ))}
                </div>
              </div>
            )
            : null
          }
          <hr className="border-neutral-200 dark:border-neutral-800 my-2" />
          

          <Drawer
            title="See More"
            wrapperClass="my-2"
            buttonClass="font-bold"
          >
            <div className="flex flex-wrap gap-x-4 mb-2">
              <span className="font-bold">Mint Address: </span>
              <a className="block hover:scale-105 duration-300 w-fit" href={solscanUrl} target="_blank" rel="noreferrer">
                {truncate(token?.mint)}
              </a>
            </div>

            <div className="flex flex-wrap gap-x-4 mb-2">
              <p className="font-bold ">Creators: </p>
              {token.creators?.map(creator => (
                <AddressLink key={creator.address} address={creator.address} />
              ))}
            </div>    
            {typeof token?.isMutable !== "undefined" ? (
              <div className="flex gap-4 mb-2">
                <p className="font-bold">Mutable: </p>
                <p>{token.isMutable.toString()}</p>
              </div>
            ) : null}
            {externalUrl ? (
              <div className="flex gap-4">
                <p className="font-bold">External Url: </p>
                <a href={externalUrl} target="_blank" rel="noreferrer">{token.externalUrl}</a>
              </div>
            ) : null}


            {token.attributes?.length > 0 ? (
              <>
                <hr className="border-neutral-200 dark:border-neutral-800 my-2" />
                <p className="font-bold mb-2">Attributes:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {token.attributes.map(attribute => (<Attribute key={attribute.trait_type} attribute={attribute} />))}
                </div>
              </>
            ) : null}


          </Drawer>
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

const Attribute = ({ attribute }) => {
  return (
    <div className="grid grid-cols-[1fr_3fr] w-full text-sm">
      <p className="font-bold truncate">{attribute.trait_type ?? attribute.traitType}:</p>
      <p className="truncate opacity-70">{attribute.value}</p>
    </div>
  )
}

export async function getServerSideProps(context) {
  const mint = context.params.mint;

  const baseCurations = await getCurationsByListingMint(mint)
    .then(res => res?.curations);

  const curations = nullifyUndefinedArr(baseCurations);
  const onlyPublished = curations?.filter(curation => curation.is_published)
  const baseToken = await getTokenByMint(mint);
  const token = nullifyUndefinedObj(baseToken);
  return { props: { token, curations: onlyPublished } };
}

