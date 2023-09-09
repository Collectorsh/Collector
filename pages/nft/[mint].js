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

export default function DetailPage({token, curations}) {
  // return <NotFound />
  // const router = useRouter();
  // const { mint } = router.query;
  // const token = useTokenByMint(mint);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageExpanded, setImageExpanded] = useState(false);
  const videoRef = useRef(null);

  const isMasterEdition = token?.is_master_edition
  const isEdition = token?.is_edition
  const supply = token?.supply
  const maxSupply = token?.max_supply
  const editionNumber = token?.edition_number

  const solscanUrl = token?.mint ? `https://solscan.io/token/${ token.mint }` : ""

  const artistName = token?.artist_name ? token.artist_name.replace("_", " ") : truncate(token?.creator, 4)
  const ownerName = token?.owner_name ? token.owner_name.replace("_", " ") : truncate(token?.owner, 4)
  const supplyText = isMasterEdition
    ? `Master - ${ maxSupply - supply }/${ maxSupply } Editions Available`
    : isEdition
      ? `Edition #${ editionNumber } ${maxSupply ? ` of ${ maxSupply }` :""}`
      : "1 of 1"

  useEffect(() => {
    if (!videoRef.current) return;
    if (videoLoaded) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }

  }, [videoLoaded])

  useEffect(() => {
    if (!token) return;

    if (token.animation_url) {
      if (token.animation_url.split(".").pop().includes("mp4")) {
        setVideoUrl(token.animation_url);
      }
    }
  }, [token]);

  const expandImage = () => setImageExpanded(!imageExpanded)

  return (
    <>
      <MainNavigation />
      <ArtModal isOpen={imageExpanded} onClose={() => setImageExpanded(false)} token={token} />
      <div className="w-full max-w-screen-2xl mx-auto px-8 py-10 grid md:grid-cols-2 gap-10">
        <div className="relative shadow-md shadow-black/25 dark:shadow-neutral-400/25 rounded-lg overflow-hidden w-fit h-fit mx-auto group">
          <button
            onClick={expandImage}
            className={clsx("absolute right-5 top-5 p-0.5",
              "bg-neutral-200 dark:bg-neutral-700 rounded shadow-lg dark:shadow-white/10",
              "duration-300",
              "opacity-50 hover:opacity-100 group-hover:opacity-100",
              "hover:scale-110 active:scale-100",
            )}
          >
            <ArrowsExpandIcon className="w-7 h-7" />
          </button>
          {!imgLoaded ? (
            <div className="w-full pb-[100%] absolute inset-0">
              <ContentLoader
                speed={2}
                className="w-full mb-4 h-full rounded-xl absolute inset-0"
                backgroundColor="rgba(120,120,120,0.2)"
                foregroundColor="rgba(120,120,120,0.1)"
              >
                <rect className="w-full h-full" />
              </ContentLoader>
            </div>
          ) : null}

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
                className="w-full h-full cursor-pointer object-center object-cover absolute inset-0 z-10 duration-200 opacity-0"
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
            className="max-h-[80vh]"
            token={token}
            useUploadFallback
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="collector text-4xl">{token?.name}</h1>
              {artistName
                ? (
                    <p>by {artistName}</p>
                ) : null
              }
              <p className=''>{supplyText}</p>
            </div>
            <div>
              <p className="text-lg collector leading-[40px]">Owned by {ownerName}</p>
              <a className="block hover:scale-105 duration-300" href={solscanUrl}>{truncate(token?.mint)}</a>
            </div>
          </div>
          <p className="text-xs mt-5 whitespace-pre-wrap">{token?.description}</p>
          {curations.length > 0
            ? (
              <div className="mt-10">
                <hr className="border-neutral-200 dark:border-neutral-800" />
                <h2 className="text-lg mt-5">Curation Listings</h2>
                {curations?.map(curation => (
                  <DetailListings key={token.mint} curation={curation} mint={token.mint} />
                ))}
              </div>
            )
            : null
          }
        </div>
      </div>
    </>
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

