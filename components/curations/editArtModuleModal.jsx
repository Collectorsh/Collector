import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton, { WarningButton } from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import SearchBar from "../SearchBar";
import { RoundedCurve } from "./roundedCurveSVG";
import { XCircleIcon } from "@heroicons/react/solid";
import { ArtItem } from "./artModule";
import useBreakpoints from "../../hooks/useBreakpoints";
import { truncate } from "../../utils/truncate";

const tabs = ["submitted"]

export default function EditArtModuleModal({ isOpen, onClose, onEditArtModule, artModule, submittedTokens, approvedArtists, onDeleteModule, tokenMintsInUse, curationType }) {
  const breakpoint = useBreakpoints()  

  const [newArtModule, setNewArtModule] = useState(artModule)
  
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(134);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const [search, setSearch] = useState("");

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

  const tokens = useMemo(() => {
    return newArtModule.tokens
      .map((tokenMint, i) => submittedTokens.find(token => token.mint === tokenMint))
      .filter(token => Boolean(token))
  }, [newArtModule.tokens, submittedTokens])
  
  const moduleFull = tokens.length >= 4
  
  const handleSave = () => {
    onEditArtModule(newArtModule);
    onClose();
    setTimeout(() => setSearch(""), 500);
  }
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSearch("")
    }, 500);
  }
  
  const itemsInModule = useMemo(() => {
    if (!tokens.length) return []
    const isMobile = ["", "sm", "md"].includes(breakpoint)
    const cols = isMobile ? 1 : tokens.length

    const totalWidthRatio = tokens.reduce((acc, token) => acc + token.aspect_ratio, 0)

    return tokens.map((token, i) => {
      const widthPercent = (token.aspect_ratio / totalWidthRatio) * 100

      const handleRemove = () => {
        if (curationType !== "curator") {//"artist" || "collector" 
          //TODO: handle auto delete submission (API should only delete if its not in published or draft)
        }

        setNewArtModule(prev => {
          const newTokens = [...prev.tokens]
          const index = newTokens.findIndex(tokenMint => tokenMint === token.mint)
          if (index < 0) return prev

          newTokens.splice(index, 1)
          return {
            ...prev,
            tokens: newTokens
          }
        })
      }

      return <EditArtItem key={token.mint} token={token} widthPercent={widthPercent} columns={cols} onRemove={handleRemove} />
    })
  }, [tokens, breakpoint, curationType])

  const contentTitle = useMemo(() => { 
    switch (curationType) {
      // case "artist": return "My Art"
      // case "collector": return "My Collection"

      case "curator":
      default: return "Submitted Art"
    }
  }, [curationType])

  const availableTokens = useMemo(() => { 
    switch (curationType) {
      // case "artist": return createdTokens
      // case "collector": return ownedTokens

      case "curator":
      default: return submittedTokens
    }
  },[curationType, submittedTokens])

  const availableTokenButtons = availableTokens?.map((token, i) => {
    // const alreadyInUse= tokens.findIndex(t => t.mint === token.mint) >= 0 //per module
    const alreadyInUse= tokenMintsInUse.includes(token.mint) //per curation

    const artist = approvedArtists.find(artist => artist.id === token.artist_id)
    const handleAdd = ({ target }) => {
      if (alreadyInUse || moduleFull) return

      if (curationType !== "curator") {//"artist" || "collector" 
        //TODO: handle auto submit
      }

      setNewArtModule(prev => ({
        ...prev,
        tokens: [...(prev?.tokens || []), token.mint]
      }))
    }
    return (
      <button className="
        relative flex justify-center flex-shrink-0 rounded-lg overflow-hidden
        duration-300 hover:scale-[102%] disabled:scale-100
        inset-0 w-full pb-[100%]
        "
        key={token.mint}
        onClick={handleAdd}
        disabled={alreadyInUse|| moduleFull}
      >
        <CloudinaryImage
          className={clsx("flex-shrink-0 object-contain shadow-lg dark:shadow-white/5",
            "w-full h-full absolute left-0 top-0",
          )}
          useMetadataFallback
          token={token}
          width={500}
        />

        {alreadyInUse ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="backdrop-blur-sm bg-neutral-200/50 dark:bg-neutral-800/50 px-2 rounded-md">Already Being Used</p>
          </div>
        ) : null}
        <div
          className="absolute text-center top-0 left-0 p-8 w-full h-full overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50 
            transition-opacity duration-300 opacity-0 hover:opacity-100
            backdrop-blur-sm flex flex-col justify-center items-center rounded-lg 
          "
        >
          <p className="font-bold">{token.name}</p>
          <p>by { artist.username}</p>
          <p className="text-xs">{truncate(token.mint)}</p>
        </div>
      </button>
    )
  })

  const content = (
    <div className="relative h-full border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {moduleFull ?
        <p
          className="absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] z-50 shadow-lg
          bg-neutral-200/50 dark:bg-neutral-800/50 px-5 py-2 rounded-lg font-bold"
        >Module Full</p>
        : null
      }
      <div className={clsx("w-full h-full p-2 overflow-auto grid gap-4 rounded-lg",
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"

      )}>
        {availableTokens?.length === 0
          ? (<div className="col-span-3 flex justify-center items-center">
            <p>
              There are currently no available artworks
            </p>
          </div>)
          : availableTokenButtons}
      </div>
    </div>
  )


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Art Module">
      <div className="overflow-y-auto grid h-screen max-h-full grid-rows-[60%,auto,1fr] mt-4 relative">
        <div className="relative flex flex-col">
          <SearchBar
            className="ml-2 pl-4 w-full max-w-[20rem]"
            search={search}
            setSearch={setSearch}
            placeholder="Search By Artwork"
          />
          <div className="relative mx-auto w-fit">
            <p className="font-bold bg-neutral-200 dark:bg-neutral-700 h-5">{contentTitle}</p>
            <RoundedCurve className="absolute bottom-0 -left-10 w-10 h-5 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
            <RoundedCurve className="absolute bottom-0 -right-10 w-10 h-5 fill-neutral-200 dark:fill-neutral-700" />
          </div>
          {content}
        </div>

        <hr className="block border-neutral-200 dark:border-neutral-700 my-4" />
        <div className={clsx(
          "w-full max-h-full p-4 overflow-auto md:overflow-visible",
          "flex flex-col md:flex-row w-full gap-2",
          "items-center md:justify-center "
        )}>
          {itemsInModule.length
            ? itemsInModule
              : <p>Click an artwork above to add it to this module</p>
            } 
        </div>
      </div>
      
      <div className="w-full flex justify-center md:justify-between items-center gap-4 mt-4 flex-wrap">
        <WarningButton onClick={onDeleteModule}>
          Delete Module
        </WarningButton>
        <div className="flex gap-4">
          <MainButton onClick={handleClose}>
            Cancel
          </MainButton>
          <MainButton onClick={handleSave} solid>
            Save
          </MainButton>
        </div>
      </div>

    </Modal>
  )
}

const EditArtItem = ({ columns, widthPercent, token, onRemove }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative duration-300 max-w-fit"
      style={{
        width: columns > 1 ? `${ widthPercent }%` : "100%"
      }}
    >
      <div className='relative block w-fit mx-auto duration-300'>
        <button
          className={clsx(
            "absolute -top-2 -right-2",
            "bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full shadow-lg dark:shadow-white/10",
            "duration-300 hover:scale-110 active:scale-100",
          )}
          onClick={onRemove}
        >
          <XCircleIcon className="w-8 h-8" />
        </button>
        <CloudinaryImage
          className={clsx(
            "object-contain",
            "shadow-lg rounded-lg",
            "max-h-[400px]"
          )}
          useUploadFallback
          token={token}
          noLazyLoad
          onLoad={() => setLoaded(true)}
        />
        {!loaded ? <p className="animate-pulse p-4">Loading...</p> : null}
      </div>
    </div>
  )
}