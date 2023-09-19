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

const tabs = ["submitted"]

//Excluding search and user owned tokens till post MVP

export default function EditArtModuleModal({ isOpen, onClose, onEditArtModule, artModule, submittedTokens, onDeleteModule }) {
  const breakpoint = useBreakpoints()  

  const [newArtModule, setNewArtModule] = useState(artModule)
  
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(134);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const [search, setSearch] = useState("");

  const moduleFull = newArtModule?.tokens.length >= 4

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
  
  const items = useMemo(() => {
    if (!newArtModule?.tokens || !submittedTokens) return []
    const isMobile = ["", "sm", "md"].includes(breakpoint)
    const cols = isMobile ? 1 : newArtModule.tokens.length

    const tokens = newArtModule.tokens
      .map((tokenMint, i) => submittedTokens.find(token => token.mint === tokenMint))
      .filter(token => Boolean(token))
    const totalWidthRatio = tokens.reduce((acc, token) => acc + token.aspect_ratio, 0)

    return tokens.map((token, i) => {
      const widthPercent = (token.aspect_ratio / totalWidthRatio) * 100

      const handleRemove = () => {
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
  }, [newArtModule?.tokens, breakpoint, submittedTokens])

  //Will need to add listing somewhere with owned tokens
  // const ownedContent = orderedTokens
  //   ? (
  //     <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
  //       <div className={clsx("w-full h-[532px] p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
  //         {orderedTokens.map((token, i) => {
  //           const isSelected = selected?.mint === token.mint;
  //           return (
  //             <button className="relative flex justify-center flex-shrink-0" key={token.mint}
  //               onClick={() => setSelected(isSelected ? null : token)}
  //             >
  //               <CloudinaryImage
  //                 className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
  //                   "w-full h-[250px] rounded-lg",
  //                   isSelected && "ring-4 ring-black dark:ring-white"
  //                 )}
  //                 //id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
  //                 //mint={token.mint}
  //                 token={token}
  //                 width={800}
  //               />
  //             </button>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   )
  //   : (
  //     <div className="h-[532px] max-h-full flex items-center justify-center">
  //       <p className="animate-pulse">Gathering your digital assets...</p>
  //     </div>
  //   )

  const submittedContent = (
    <div className="relative border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {moduleFull ?
        <p
          className="absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] z-50 shadow-lg
          bg-neutral-200/50 dark:bg-neutral-800/50 px-5 py-2 rounded-lg font-bold"
        >Module Full</p>
        : null
      }
      <div className={clsx("w-full h-full max-h-[266px] p-2 overflow-auto grid gap-4 rounded-lg", "grid-cols-1 md:grid-cols-2 xl:grid-cols-3")}>
        

        {submittedTokens?.length === 0
          ? (<div className="col-span-3 h-[250px] flex justify-center items-center">
            <p>
              There are currently no submissions
            </p>
          </div>)
          : submittedTokens?.map((token, i) => {
          const alreadyInModule = newArtModule?.tokens.findIndex(arrayTokenMint => arrayTokenMint === token.mint) >= 0
          const handleAdd = ({ target }) => {
            if (alreadyInModule || moduleFull) return             
            
            setNewArtModule(prev => ({
              ...prev,
              tokens: [...(prev?.tokens || []), token.mint]
            }))
          }
          return (
            <button className="relative flex justify-center flex-shrink-0 rounded-lg overflow-hidden duration-300 hover:scale-[102%] disabled:scale-100 disabled:opacity-50 disabled:blur-[2px]" key={token.mint}
              onClick={handleAdd}
              disabled={alreadyInModule || moduleFull}
            >
              <CloudinaryImage
                className={clsx("flex-shrink-0 object-cover shadow-lg dark:shadow-white/5",
                  "w-full h-[250px]",
                )}
                useMetadataFallback
                token={token}
                width={500}
              />
            </button>
          )
        })}
      </div>
    </div>
  )

  // const tabContent = [submittedContent, ownedContent]
  const tabContent = [submittedContent]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Art Module">
      <div className="overflow-y-auto">
        {/* <SearchBar
          className="ml-2 pl-4 w-full max-w-[20rem] mt-8"
          search={search}
          setSearch={setSearch}
          placeholder="Search By Artwork"
        /> */}
          

        <div className="relative mx-auto w-fit mt-4">
          <div className="flex justify-center space-x-2 border-b-8 border-neutral-200 dark:border-neutral-700">
            {tabs.map((tab, i) => {
              const handleClick = () => {
                setActiveTabIndex(i);
              }
              const isSelected = activeTabIndex === i;
              return (
                <button
                  key={tab}
                  ref={(el) => (tabsRef.current[i] = el)}
                  className={clsx(
                    "px-3 py-1 capitalize hover:opacity-100 hover:scale-[102%] font-bold duration-300",
                    isSelected ? "border-black dark:border-white opacity-100" : "border-transparent opacity-75")}
                  onClick={handleClick}
                >
                  {tab} Art
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

        {tabContent[activeTabIndex]}

        <hr className="block border-neutral-200 dark:border-neutral-700 my-4" />
        <div className={clsx(
          "w-full h-[400px] p-4 max-h-full overflow-auto md:overflow-visible",
          "flex flex-col md:flex-row w-full gap-2",
          "items-center md:justify-center "
        )}>
          {items.length
            ? items
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