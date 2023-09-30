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
import VideoPlayer from "../../components/artDisplay/videoPlayer";
import useNftFiles from "../../components/artDisplay/useNftFiles";

export default function DetailPage({token, curations}) {
  // return <NotFound />
  // const router = useRouter();
  // const { mint } = router.query;
  // const token = useTokenByMint(mint);

  const {videoUrl} = useNftFiles(token)

  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageWidth, setImageWidth] = useState("70vw");
  const imageRef = useRef(null);

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

  const expandImage = () => setImageExpanded(!imageExpanded)


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
          {(videoUrl && !imageExpanded) ? (
            <VideoPlayer
              id={`video-player-${ token.mint }`}
              videoUrl={videoUrl}
              videoLoaded={videoLoaded}
              setVideoLoaded={setVideoLoaded}
            />
          ) : null}

          <CloudinaryImage
            imageRef={imageRef}
            className={clsx("max-h-[75vh]", videoLoaded && "invisible")}
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

