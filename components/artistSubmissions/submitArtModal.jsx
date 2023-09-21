import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import { RoundedCurve } from "../curations/roundedCurveSVG";
import { XIcon } from "@heroicons/react/solid";
import { Oval } from "react-loader-spinner";
import SearchBar from "../SearchBar";

const tabs = ["1/1", "Master Editions"]

export default function SubmitArtModal({ isOpen, onClose, onSubmit, curation, tokens, submissionMints }) {
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(49);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const curationName = curation?.name.replaceAll("_", " ")

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      if (!currentTab) return
      setTabUnderlineLeft(currentTab.offsetLeft);
      setTabUnderlineWidth(currentTab.clientWidth);
    }
    setTabPosition()
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);


  const clearState = () => {
    setTimeout(() => {
      setSelectedTokens([]);
    }, 500);
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(curation, selectedTokens);
    onClose();
    clearState()
    setSubmitting(false);
  }

  const handleClose = () => {
    onClose();
    clearState()
  }

  const searchFilter = useCallback((token) => {
    const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
    const artistNameMatch = token.artist_name?.toLowerCase().includes(search.toLowerCase())
    const mintAddressMatch = token.mint.toLowerCase() == search.toLowerCase()
    return search ? (artNameMatch || artistNameMatch || mintAddressMatch) : true;
  }, [search])

  const ownedContent = useMemo(() => {
    if (!tokens) return null

    const masterEditions = []
    const editions = []
    const artTokens = []
    
    tokens.forEach(token => {
      if(!searchFilter(token)) return
      const notSubmittedAnywhere = !submissionMints.includes(token.mint)
      const notSubmittedForThisCuration = !curation?.submitted_token_listings.find(t => t.mint === token.mint)
      const soldOut = token.is_master_edition ? token.supply >= token.max_supply : false
      if (token.is_master_edition && notSubmittedAnywhere && !soldOut) masterEditions.push(token)
      else if (token.is_edition && notSubmittedForThisCuration) editions.push(token)
      else if (!token.is_master_edition && !token.is_edition && notSubmittedForThisCuration) artTokens.push(token)
    })    

    const filteredTokens = activeTabIndex === 0 ? artTokens : masterEditions

    return filteredTokens.map((token) => {
      return (
        <ArtworkItem
          key={token.mint}
          token={token}
          // alreadySubmitted={alreadySubmitted}
          selectedTokens={selectedTokens}
          setSelectedTokens={setSelectedTokens}
        />
      )
    })
  }, [tokens, selectedTokens, curation?.submitted_token_listings, activeTabIndex, submissionMints, searchFilter])
        

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Submit Artworks`}>
      <div className="overflow-y-auto">
        <p className="mt-4 text-lg font-bold text-center">Choose the pieces you would like to submit to {curationName}</p>
        <p className="text-center mb-4">Your curator {curation?.curator.username} will receive {curation?.curator_fee}% of the sale price</p>

        
        <SearchBar
          className="ml-2 pl-4 w-full max-w-[20rem]"
          search={search}
          setSearch={setSearch}
          placeholder="Search By Artwork"
        />
        <div className="relative mx-auto w-fit">
          <div className="flex justify-center space-x-2 border-b-8 border-neutral-200 dark:border-neutral-700">
            {tabs.map((tab, i) => {
              const handleClick = () => {
                setActiveTabIndex(i);
              }
              const isSelected = activeTabIndex === i;

              // if(i === 0 && !activeTabIndex) setActiveTabIndex(0)

              return (
                <button
                  key={tab}
                  ref={(el) => (tabsRef.current[i] = el)}
                  className={clsx(
                    "px-3 py-1 capitalize hover:opacity-100 hover:scale-[102%] font-bold duration-300",
                    isSelected ? "border-black dark:border-white opacity-100" : "border-transparent opacity-75")}
                  onClick={handleClick}
                >
                  {tab}
                </button>
              )
            })}

          </div>
          <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
          <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700" />
          <span
            className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner shadow-black/10 dark:shadow-white/10"
          />
          <span
            className="absolute rounded-full bottom-0 block h-1 bg-black dark:bg-white transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
        </div>

        <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-900">
          <div className={clsx("w-full flex-shrink-0 h-[266px] p-2 overflow-auto grid gap-4 rounded-lg",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {tokens
              ? ownedContent
              : (
                <div className="col-span-4 h-full flex justify-center items-center">
                  <p className="animate-pulse">Gathering your digital assets...</p>
                </div>
              )
            }
          </div>
        </div>

        <div className="relative mx-auto w-fit mt-8">
          <p className="bg-neutral-200 dark:bg-neutral-700 h-6 font-bold">Submitting</p>
          <RoundedCurve className="absolute bottom-0 -left-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
          <RoundedCurve className="absolute bottom-0 -right-8 w-8 h-6 fill-neutral-200 dark:fill-neutral-700" />
        </div>
        <div className="min-h-[5.5rem] border-4 rounded-xl p-2
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
        flex items-start flex-wrap gap-2
        ">
          {selectedTokens.map((token, i) => {
            return (
              <ArtChip
                key={token.mint}
                name={token.name}
                isMasterEdition={token.is_master_edition}
                onRemove={() => setSelectedTokens(prev => prev.filter(a => a.mint !== token.mint))}
              />
            )
          })}
        </div>
      </div>
      <div className="w-full flex justify-end gap-4 relative mt-4">
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton
          className="w-32"
          onClick={handleSubmit}
          solid
          disabled={!selectedTokens.length || submitting}
        >
          {submitting
            ? (
              <span className="inline-block translate-y-0.5">
                <Oval color="#FFF" secondaryColor="#666" height={17} width={17} />
              </span>
            )
            : "Submit!"
          }
        </MainButton>
      </div>

    </Modal>
  )
}


const ArtChip = ({ name, onRemove, isMasterEdition }) => {
  return (
    <div className="flex items-center gap-1 rounded-lg pl-2 pr-1
    bg-white dark:bg-black
      border border-neutral-200 dark:border-neutral-700
    ">
      <p className="flex items-center gap-1">
        {name}
        <span className="text-xs italic">{isMasterEdition ? "(Master Edition)" : ""}</span>
      </p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 hover:scale-110 active:scale-100 duration-300">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

const ArtworkItem = ({ token, alreadySubmitted, selectedTokens, setSelectedTokens}) => {
  const imageRef = useRef(null)
  const [loadingArt, setLoadingArt] = useState(false)
  
  const index = selectedTokens.findIndex((t) => t.mint === token.mint);
  const isSelected = index !== -1;

  const isEdition = token.is_edition
  const isMasterEdition = token.is_master_edition

  const getAspectRatio = (imageElement) => {

    if (token.animation_url) {
      try {
        if (token.animation_url.split(".").pop().split("ext=").pop().includes("mp4")) {
          //fetch video dimensions
          const video = document.createElement("video")
         
          return new Promise((resolve, reject) => {
            video.onloadedmetadata = () => resolve(Number(video.videoWidth / video.videoHeight))
            video.onerror = (err) => reject(new Error(`Unable to load video - ${err}`));
            video.src = token.animation_url
            video.load()
          });
        } else {
          //TODO handle HTML and GLB
        }

      } catch (err) {
        console.log("Error fetching non-image dimensions: ", err)
      }
    }
    return Number(imageElement.naturalWidth / imageElement.naturalHeight)
  }

  const handleClick = async () => {
    if (!imageRef.current || !token.image) return

    if (isSelected) {
      setSelectedTokens(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    } else {
      const newToken = { ...token }
  
      setLoadingArt(true)
      newToken.aspect_ratio = await getAspectRatio(imageRef.current)
      setLoadingArt(false)
  
      setSelectedTokens(prev => [...prev, newToken])
    }
  }

  return (
    <button className="relative flex justify-center flex-shrink-0 disabled:scale-100 disabled:blur-[2px]"
      key={token.mint}
      onClick={handleClick}
      disabled={alreadySubmitted || loadingArt }
    >
      <CloudinaryImage
        imageRef={imageRef}
        className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
          "w-full h-[250px] rounded-lg",
          isSelected && "ring-4 ring-black dark:ring-white",
          alreadySubmitted && "opacity-50 blur-[2px]"
        )}
        token={token}
        width={800}
        useMetadataFallback
      />
      {alreadySubmitted
        ? <p className="absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] z-50 shadow-lg
              bg-neutral-200/50 dark:bg-neutral-800/50 px-5 py-2 rounded-lg font-bold"
        >
          Already Submitted</p>
        : null}
    </button>
  )
  
}