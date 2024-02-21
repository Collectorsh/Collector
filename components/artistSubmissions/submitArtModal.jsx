import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import { RoundedCurve } from "../curations/roundedCurveSVG";
import { Oval } from "react-loader-spinner";
import SearchBar from "../SearchBar";
import { truncate } from "../../utils/truncate";
import useNftFiles from "../../hooks/useNftFiles";
import { error } from "../../utils/toast";
import { Metaplex } from "@metaplex-foundation/js";
import { connection } from "../../config/settings";
import { getMasterEditionSupply } from "../../utils/solanaWeb3/getMasterEditionSupply";
import * as Icon from "react-feather"

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
        <p className="mb-6 text-lg font-bold text-center textPalette2">Choose the pieces you would like to submit to {curationName}</p>
        {/* <p className="text-center mb-4">Your curator {curation?.curator.username} will receive {curation?.curator_fee}% of the sale price</p> */}

        
        <SearchBar
          className="ml-2 pl-4 w-full max-w-[20rem]"
          search={search}
          setSearch={setSearch}
          placeholder="Search By Artwork"
        />
        <div className="relative mx-auto w-fit">
          <div className="flex justify-center space-x-2 border-b-8  borderPalette3">
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
                    "px-3 py-0 my-1 capitalize  font-bold duration-300",
                    "hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded"
                  )}
                  onClick={handleClick}
                >
                  {tab}
                </button>
              )
            })}

          </div>
          <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-zinc-300 dark:fill-zinc-700 transform scale-x-[-1]" />
          <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-zinc-300 dark:fill-zinc-700" />
          <span
            className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner palette2 shadow-black/10 dark:shadow-white/10"
          />
          <span
            className="absolute rounded-full bottom-0 block h-1 bg-zinc-700 dark:bg-zinc-300 transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
        </div>

        <div className="border-4 rounded-xl overflow-hidden flex-shrink-0 palette2 borderPalette3">
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
          <p className="bg-zinc-300 dark:bg-zinc-700 h-6 font-bold">Submitting</p>
          <RoundedCurve className="absolute bottom-0 -left-8 w-8 h-6 fill-zinc-300 dark:fill-zinc-700 transform scale-x-[-1]" />
          <RoundedCurve className="absolute bottom-0 -right-8 w-8 h-6 fill-zinc-300 dark:fill-zinc-700" />
        </div>
        <div className="min-h-[5.5rem] border-4 rounded-xl p-2
        palette2 borderPalette3
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
        <MainButton onClick={handleClose} size="lg" className="w-[7.5rem]">
          Cancel
        </MainButton>
        <MainButton
          size="lg"
          className="w-[7.5rem]"
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
     palette1
      border border-zinc-300 dark:border-zinc-700
    ">
      <p className="flex items-center gap-1">
        {name}
        <span className="text-xs italic">{isMasterEdition ? "(Master Edition)" : ""}</span>
      </p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 duration-300">
        <Icon.X size={16} />
      </button>
    </div>
  )
}

const ArtworkItem = ({ token, alreadySubmitted, selectedTokens, setSelectedTokens}) => {
  const imageRef = useRef(null)
  const {videoUrl} = useNftFiles(token)
  const [loadingArt, setLoadingArt] = useState(false)
  
  const index = selectedTokens.findIndex((t) => t.mint === token.mint);
  const isSelected = index !== -1;

  const isEdition = token.is_edition
  const isMasterEdition = token.is_master_edition

  const getAspectRatio = async (imageElement) => {
    try {
      if (videoUrl) {
        //fetch video dimensions
        const video = document.createElement("video")
        
        return await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve(Number(video.videoWidth / video.videoHeight))
          video.onerror = (err) => reject(`Unable to load video - ${ err }`);
          video.src = videoUrl
          video.load()
        });
      } 
    } catch (err) {
      console.log("Error fetching non-image dimensions: ", err)
      return null
    }

    //else its not video
    return Number(imageElement.naturalWidth / imageElement.naturalHeight)
  }

  const handleClick = async () => {
    if (!imageRef.current || !token.image) return

    if (isSelected) {
      setSelectedTokens(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    } else {
      const newToken = { ...token }
  
      setLoadingArt(true)
      const aspectRatio = await getAspectRatio(imageRef.current)
      setLoadingArt(false)

      if (!aspectRatio) {
        console.log("Error getting aspect ratio")
        error(`Unable to process ${videoUrl ? "video" : "image"}`)
        return
      }
      
      newToken.aspect_ratio = aspectRatio

      if (isMasterEdition) {
        //fetch live supply count
        const metaplex = new Metaplex(connection)
        const trueSupply = await getMasterEditionSupply(token.mint, metaplex)

        if (trueSupply !== undefined) {
          newToken.supply = trueSupply
        }
      }
  
      setSelectedTokens(prev => [...prev, newToken])
    }
  }

  return (
    <button className="relative flex justify-center flex-shrink-0 disabled:scale-100 disabled:blur-[2px] group"
      key={token.mint}
      onClick={handleClick}
      disabled={alreadySubmitted || loadingArt }
    >
      <CloudinaryImage
        imageRef={imageRef}
        className={clsx("flex-shrink-0 overflow-hidden object-contain shadow hover:shadow-md palette1",
          "w-full h-[250px] rounded-lg",
          isSelected && "ring-4 ring-zinc-700 dark:ring-zinc-300",
          alreadySubmitted && "opacity-50 blur-[2px]"
        )}
        token={token}
        width={800}
        useMetadataFallback
      />
      {alreadySubmitted
        ? <p className="absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] z-50 shadow-lg
              bg-zinc-200/50 dark:bg-zinc-800/50 px-5 py-2 rounded-lg font-bold"
        >
          Already Submitted</p>
        : null
      }
      {loadingArt ? (
        <div className="absolute inset-0 w-full h-full flex justify-center items-center">
          <Oval color="#FFF" secondaryColor="#666" height={48} width={48} />
        </div>
      ) : null
      }
      <div
        className="absolute text-center top-0 left-0 p-8 w-full h-full overflow-hidden bg-zinc-200/50 dark:bg-zinc-800/50 
          transition-opacity duration-300 opacity-0 group-hover:opacity-100
          backdrop-blur-sm flex flex-col justify-center items-center rounded-lg 
          "
      >
        <p className="font-bold">{token.name}</p>
        <p>{truncate(token.mint)}</p>
      </div>
    </button>
  )
  
}