import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton, { WarningButton } from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import SearchBar from "../SearchBar";
import { RoundedCurve } from "./roundedCurveSVG";
import useBreakpoints from "../../hooks/useBreakpoints";
import { getTokenAspectRatio } from "../../hooks/useNftFiles";
import debounce from "lodash.debounce";
import { useTokens } from "../../data/nft/getTokens";
import UserContext from "../../contexts/user";
import SortableArt from "./sortableArt";
import SortableArtWrapper from "./sortableArtWrapper";
import { submitTokens } from "../../data/curationListings/submitToken";
import { error } from "../../utils/toast";
import { Oval } from "react-loader-spinner";
import { groupCompressed, groupEditions } from "../../utils/groupEditions";
import GroupedCollection from "./groupedCollection";
import AddTokenButton from "./addTokenButton";
import Checkbox from "../checkbox";

import * as Icon from "react-feather";
import { generateArrayAroundNumber } from "../../utils/maths";
import { useOrdinals } from "../../data/nft/getOrdinals";
import Toggle from "../Toggle";
import { Switch } from "@headlessui/react";


export default function EditArtModuleModal({
  isOpen, onClose,
  onEditArtModule,
  artModule,
  onDeleteModule,
  curationId,
  setSubmittedTokens,
  submittedTokens,
  approvedArtists,
  tokenMintsInUse,
  curationType
}) {
  const breakpoint = useBreakpoints()
  const isMobile = ["", "sm"].includes(breakpoint)
  const [user] = useContext(UserContext);
  const wrapperRef = useRef();
  
  const [newArtModule, setNewArtModule] = useState(artModule)
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const [search, setSearch] = useState("");
  const [groupByCollection, setGroupByCollection] = useState(false);

  const [tokensToSubmit, setTokensToSubmit] = useState([]);//only used for personal curations
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(0);
  const perPage = 20;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(49);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const divRef = useRef(null)
  const expandRef = useRef(null)
  const startYRef = useRef(null)
  const startHeightRef = useRef(null)

  // const ordinals = useOrdinals()
  // const [usingOrdinals, setUsingOrdinals] = useState(false)


  const handleResize = () => {
    if (!wrapperRef.current) return;
    setWrapperWidth(wrapperRef.current.clientWidth)
    setWrapperHeight(wrapperRef.current.clientHeight)

    const currentTab = tabsRef.current[activeTabIndex];
    if (!currentTab) return
    setTabUnderlineLeft(currentTab.offsetLeft);
    setTabUnderlineWidth(currentTab.clientWidth);
  }
  const debouncedResize = debounce(handleResize, 250)

  const onDragStart = (e) => {
    startYRef.current = e.clientY;
    startHeightRef.current = parseInt(document.defaultView.getComputedStyle(divRef.current).height, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
  }

  function doDrag(e) {
    divRef.current.style.maxHeight = (startHeightRef.current + e.clientY - startYRef.current) + 'px';
  }

  function stopDrag() {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
    debouncedResize()
  }

  const tabs = curationType === "collector" ? ["1/1", "Editions", "Compressed"] : ["1/1", "Master Editions", "Compressed"]
  
  //Dont fetch user tokens if this is a curator curation
  const useUserTokens = curationType !== "curator" 

  // if collector curation, fetch all owned tokens like normal;
  // if artist curation, user creator query
  const useCreatorQuery = curationType === "artist" 
  const useArtistDetails = curationType === "collector"//probably dont need for artist curations
  const { tokens: userTokens, loading, total, current } = useTokens(useUserTokens ? user?.public_keys : null, {
    queryByCreator: useCreatorQuery,
    useArtistDetails: useArtistDetails,
    useTokenMetadata: true,
    justVisible: false,
  });

  const loadingCounter = total ? ` (${ current }/${ total })` : "..."

  const gapSize = 24

  const useGroupedTokens = groupByCollection && useUserTokens && !search

  useEffect(() => {
    setTimeout(handleResize, 500)
    window.addEventListener("resize", debouncedResize)
    return () => {
      debouncedResize.cancel()
      window.removeEventListener("resize", debouncedResize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTabIndex])

  const tokens = useMemo(() => {
    return newArtModule.tokens
      .map((tokenMint, i) => submittedTokens.find(token => token.mint === tokenMint))
      .filter(token => Boolean(token))
  }, [newArtModule.tokens, submittedTokens])
  
  const moduleFull = tokens?.length >= 4
  
  const handleSave = async () => {
    const newArtModuleCopy = {...newArtModule}
    
    if (curationType !== "curator" && tokensToSubmit?.length) {//"artist" || "collector" 
      setSaving(true)

      const res = await submitTokens({
        tokens: tokensToSubmit,
        apiKey: user.api_key,
        curationId: curationId,
      })

      if (!res || res?.status !== "success") {
        error(`Failed to save artworks`)
        setSaving(false)
        return
      } 
      if (res?.errors?.length) {
        newArtModuleCopy.tokens = newArtModuleCopy.tokens.filter(tokenMint => !res.errors.find(err => err.mint === tokenMint))
        setNewArtModule(newArtModuleCopy)
        setSubmittedTokens(prev => prev.filter(token => !res.errors.find(err => err.mint === token.mint)))
        res.errors.forEach(err => error(err.message))
      }
      setSaving(false)
    }

    onEditArtModule(newArtModuleCopy);
    setTokensToSubmit([]);
    handleClose(false);
  }
  const handleClose = (reset = true) => {
    onClose();
    setTimeout(() => {
      setSearch("")
      setSaving(false)
      if(reset) setNewArtModule(artModule)
    }, 500);
  }

  const handleTokenToSubmit = useCallback((token) => { 
    if (submittedTokens.find(t => t.mint === token.mint)) return;
    setTokensToSubmit(prev => [...prev, token])
    setSubmittedTokens(prev => [...prev, token])
  },[submittedTokens, setSubmittedTokens])

  const userTokensSplit = useMemo(() => {
    const masterEditions = []
    const editions = []
    const artTokens = []
    const compressedTokens = []
    const remainingTokens = []    
    
    if (userTokens?.length) userTokens.forEach(token => {
      const soldOut = token.is_master_edition ? token.supply >= token.max_supply : false
      const isOneOfOne = !token.is_master_edition && !token.is_edition
      const useMasterEdition = token.is_master_edition && (curationType === "artist" || !soldOut)
      if (useMasterEdition) masterEditions.push(token)
      else if (token.is_edition) editions.push(token)
      else if (token.compressed) compressedTokens.push(token)
      else if (isOneOfOne) artTokens.push(token)
      else remainingTokens.push(token)
    })

    const groupedCompressed = groupCompressed(compressedTokens)
    const groupedEditions = groupEditions(editions)
    return {
      masterEditions,
      // editions: filterCompressed ? groupedEditions : [...groupedEditions, ...compressedTokens],
      editions: groupedEditions,
      compressedTokens: groupedCompressed,
      artTokens,
      remainingTokens,
    }
  }, [userTokens, curationType])
 
  const itemsInModule = useMemo(() => {
    if (!tokens.length || !wrapperWidth) return []

    const cols = isMobile ? 1 : tokens.length
    
    const mappedAspectRatios = {}
    let totalAspectRatio = 0;
    
    tokens.forEach(token => {
      const mint = token.mint;
      const aspect = getTokenAspectRatio(token)
      totalAspectRatio += aspect
      mappedAspectRatios[mint] = aspect
    })

    const maxHeight = wrapperHeight;
    const rowGapOffset = gapSize * (tokens.length - 1);
    const rowHeight = Math.min((wrapperWidth - rowGapOffset) / totalAspectRatio, maxHeight);

    return tokens.map((token, i) => {
      const tokenWidth = cols > 1
        ? mappedAspectRatios[token.mint] * rowHeight
        : Math.min(wrapperWidth, mappedAspectRatios[token.mint] * maxHeight);
      
      const tokenHeight = cols > 1
        ? rowHeight
        : tokenWidth / mappedAspectRatios[token.mint];

      const handleRemove = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (curationType !== "curator") {//"artist" || "collector" 
          //remove from the to submit list if there
          setTokensToSubmit(prev => { 
            const index = prev.findIndex(t => t.mint === token.mint)
            
            if (index < 0) return prev;

            const newTokens = [...prev]
            newTokens.splice(index, 1)
            return newTokens
          })
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
      return (
        <SortableArt id={token.mint} key={token.mint}>
          <EditArtItem
            token={token}
            width={tokenWidth}
            height={tokenHeight}
            onRemove={handleRemove}
          />
        </SortableArt>
      )
    })
  }, [tokens, isMobile, curationType, wrapperWidth, wrapperHeight])

  const contentTitle = useMemo(() => {
    switch (curationType) {
      case "artist": return "My Art"
      // case "collector": return "My Collection"

      case "curator":
      default: return "Submitted Art"
    }
  }, [curationType])

  const availableTokens = useMemo(() => {
    const { masterEditions, editions, artTokens, compressedTokens } = userTokensSplit;
    switch (curationType) {
      case "artist": {
        switch (activeTabIndex) {
          case 0: return artTokens
          case 1: return masterEditions
          case 2: return compressedTokens
          default: return []
        }
      }
      case "collector": {
        switch (activeTabIndex) {
          case 0: return artTokens
          case 1: return editions
          case 2: return compressedTokens
          default: return []
        }
      }
      case "curator":
      default: return submittedTokens || []
    }
  }, [curationType, submittedTokens, userTokensSplit, activeTabIndex])
  
  const availableTokenButtons = useMemo(() => {
    //if searching or not userTokens don't group
    
    const makeTokenButtons = (tokensToMake) => tokensToMake.map((token, i) => {
      const inUseHere = tokens.findIndex(t => t.mint === token.mint) >= 0 //in this module currently
      let inUseElseWhere = false;
      Object.entries(tokenMintsInUse).forEach(([moduleId, mints]) => { //used in other modules
        if (moduleId === newArtModule.id) return;
        if (mints.includes(token.mint)) inUseElseWhere = true;
      });

      const alreadyInUse = inUseHere || inUseElseWhere;

      const artistUsername = useUserTokens
        ? token.artist_name
        : approvedArtists.find(artist => artist.id === token.artist_id).username;

      const mintsInUse = [
        ...Object.values(tokenMintsInUse),
        ...tokens.map(t => t.mint)
      ]
      return (
        <AddTokenButton
          key={`token-${ token.mint }`}
          token={token}
          alreadyInUse={alreadyInUse}
          artistUsername={artistUsername}
          moduleFull={moduleFull}
          handleTokenToSubmit={handleTokenToSubmit}
          setNewArtModule={setNewArtModule}
          curationType={curationType}
          mintsInUse={mintsInUse}
        />
      )
    })


    if (useGroupedTokens) {
      const fallbackName = "None"
      const collections = {
        [fallbackName]: {
          name: fallbackName,
          tokens: [] 
        }
      }
      availableTokens.forEach(token => {
        const cName = token.collection?.name || fallbackName;
        
        const tokenNoColleciton = { ...token }
        delete tokenNoColleciton.collection //remove circular reference
        
        if (!collections[cName]) {
          collections[cName] = { ...token.collection }
          collections[cName].tokens = [tokenNoColleciton]
        } else collections[cName].tokens.push(tokenNoColleciton);
        
      })
      const sorted = Object.values(collections)
        .sort((a, b) => {
          // Move `fallbackName` to the end
          // if (a.name === fallbackName) return -1;
          // if (b.name === fallbackName) return 1; 

          return b.tokens.length - a.tokens.length
        })
      return sorted
        .map((collection, i) => {
          return(
            <GroupedCollection
              key={collection.name + i}
              collection={collection}
              makeTokenButtons={makeTokenButtons}
            />
          )
      })

    } else {
      //all together
      const spotInList = page * perPage;
      const tokens = !search
        ? availableTokens.slice(spotInList, spotInList + perPage)
        : availableTokens.filter((token) => { 

          if (!search) return true;
          const artistUsername = useUserTokens
            ? token.artist_name
            : approvedArtists.find(artist => artist.id === token.artist_id).username;
        
          return token.mint === search
            || token.name.toLowerCase().includes(search.toLowerCase())
            || artistUsername?.toLowerCase().includes(search.toLowerCase())
          
        })

      return makeTokenButtons(tokens)
    }
  }, [availableTokens, search, useUserTokens, approvedArtists, tokens, tokenMintsInUse, moduleFull, handleTokenToSubmit, curationType, newArtModule.id, page, useGroupedTokens])

  const content = (
    <div className="relative h-full max-h-[333px] min-h-[200px] min border-4 rounded-xl bg-neutral-200 dark:bg-neutral-900 borderPalette3"//max-h-[333px]  h-full min-h-[200px]
      ref={divRef}
    >
      {moduleFull ?
        (
          <div className="absolute inset-0 z-50 h-full flex justify-center items-center backdrop-blur-sm">
            <p
              className="shadow-lg
              bg-neutral-100 dark:bg-neutral-800 px-5 py-2 rounded-lg font-bold"
            >Module Full (max 4 pieces)</p>
           </div> 
        )
        : null
      }


      <div
        className={clsx("w-full h-full p-2 overflow-auto grid gap-4 rounded-lg",
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        )}
      >
       
        {!availableTokens?.length 
          ? (
            <div className="col-span-5 flex justify-center items-center">
              {(useUserTokens && !userTokens?.length)
                ? <p className="animate-pulse">Gathering your digital assets{loadingCounter}</p>
                : <p>Looks like nothing is here yet.</p>
              }
            </div>
          )
          : !search || availableTokenButtons.length
            ? availableTokenButtons
            : (
              <div className="col-span-5 flex justify-center items-center">
                <p className="font-bold">No results found</p>
              </div>
            )
        }
      </div>
    </div>
  )

  const tokensLabel = useUserTokens ? (
    <>
      
      <div className="relative mx-auto w-fit">
        <div className="flex justify-center space-x-2 border-b-8 borderPalette3">
          {tabs.map((tab, i) => {
            const handleClick = () => {
              setPage(0);
              setActiveTabIndex(i);
            }
            const isSelected = activeTabIndex === i;
            return (
              <button
                key={tab}
                ref={(el) => (tabsRef.current[i] = el)}
                className={clsx(
                  "px-3 py-0 my-1 capitalize  font-bold duration-300",
                  "hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded",
                )}
                onClick={handleClick}
              >
                {tab}
              </button>
            )
          })}

        </div>
        <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1]" />
        <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-neutral-300 dark:fill-neutral-700" />
        <span
          className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner palette2 shadow-black/10 dark:shadow-white/10"
        />
        <span
          className="absolute rounded-full bottom-0 block h-1 bg-neutral-700 dark:bg-neutral-300 transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </div>
    </>
  )
    : (
      <div className="relative mx-auto w-fit">
        <p className="font-bold bg-neutral-300 dark:bg-neutral-700 h-5">{contentTitle}</p>
        <RoundedCurve className="absolute bottom-0 -left-10 w-10 h-5 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1]" />
        <RoundedCurve className="absolute bottom-0 -right-10 w-10 h-5 fill-neutral-300 dark:fill-neutral-700" />
      </div>
    )


  
  const pagination = (
    <div className="relative mx-auto w-fit">
      <div className="bg-neutral-300 dark:bg-neutral-700 h-7 flex justify-center items-center pb-1 font-bold text-small">
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(0)}
          disabled={page === 0}
        >
          <Icon.ChevronsLeft/>
        </button>
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(prev => prev - 1)}
          disabled={page === 0}
        >
          <Icon.ChevronLeft />
        </button>
        {/* <p className="px-1 leading-none">
          {page + 1} / {Math.floor(availableTokens.length / perPage) + 1}
        </p> */}
        {generateArrayAroundNumber({
          num: page,
          lowerBound: 0,
          upperBound: Math.floor(availableTokens.length / perPage)
        }).map((num, i) => (
          <button
            key={i}
            className={clsx(
              "rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none w-7 h-7 hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300",
              num === page ? "bg-neutral-200 dark:bg-neutral-800" : ""
            )}
            onClick={() => setPage(num)}
          >
            {num + 1}
          </button>
        ))}
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(prev => prev + 1)}
          disabled={page >= Math.floor(availableTokens.length / perPage)}
        >
          <Icon.ChevronRight />
        </button>
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(Math.floor(availableTokens.length / perPage))}
          disabled={page >= Math.floor(availableTokens.length / perPage)}
        >
          <Icon.ChevronsRight />
        </button>
      </div>
      <RoundedCurve className="absolute bottom-0 -right-10 w-10 h-7 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1] rotate-180" />
      <RoundedCurve className="absolute bottom-0 -left-10 w-10 h-7 fill-neutral-300 dark:fill-neutral-700 rotate-180" />
    </div>
  )

  const showPagination = !search && !useGroupedTokens && availableTokens?.length > perPage;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editing Art">
      <div
        className="overflow-y-auto grid h-screen max-h-full grid-rows-[auto,auto,1fr] mt-4 relative"
      >
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between flex-wrap gap-2 lg:mb-0 mb-3">
            <SearchBar
              className="w-full max-w-[20rem] bg-neutral-200 dark:bg-neutral-900"
              search={search}
              setSearch={setSearch}
              placeholder="Search"
            />

            {/* <div>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch.Label className="mr-4">Use Ordinals</Switch.Label>
                  <Switch
                    checked={usingOrdinals}
                    onChange={setUsingOrdinals}
                    className={`${ usingOrdinals ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${ usingOrdinals ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
              <Checkbox
                className={clsx(
                  "pr-3 ",
                  !useUserTokens && "hidden",
                )}
                checkboxClassName="borderPalette3 bg-neutral-200 dark:bg-neutral-900"
                label="Group by Collection"
                checked={groupByCollection}
                onChange={() => setGroupByCollection(prev => !prev)}
              />
            </div> */}

            <Checkbox
              className={clsx(
                "pr-3 ",
                !useUserTokens && "hidden",
              )}
              checkboxClassName="borderPalette3 bg-neutral-200 dark:bg-neutral-900"
              label="Group by Collection"
              checked={groupByCollection}
              onChange={() => setGroupByCollection(prev => !prev)}
            />
         
          </div>
          {tokensLabel}
          {content}
          {showPagination ? pagination : null}
        </div>

        <button
          className="cursor-[row-resize] my-3 flex flex-col items-center justify-center w-full gap-[2px]"
          ref={expandRef}
          onClick={() => console.log("expand")}
          onMouseDown={onDragStart}
        >
          <hr className="block borderPalette3 w-8 border" />
          <hr className="block borderPalette3 w-full border" />
          <hr className="block borderPalette3 w-8 border"/>
        </button>

        <div className="px-3 py-2 w-full overflow-hidden relative min-h-[340px] h-full">
          <div className={clsx(
            "w-full min-h-[4rem] relative h-full",
          )} 
            ref={wrapperRef}
          >
           
            <SortableArtWrapper
              artModule={newArtModule} 
              setArtModule={setNewArtModule}
              itemsInModule={itemsInModule}
            >
              <div
                style={{ gap: gapSize }}
                className={clsx(
                  "flex flex-col sm:flex-row w-full h-full",
                  "justify-center items-center"
                )}
              >
                {itemsInModule.length
                  ? itemsInModule      
                  : <p className="text-center">Click an artwork above to add it to this block</p>
                } 
              </div>
            </SortableArtWrapper>
          </div>
        </div>
      </div>
      
      <div className="w-full flex justify-center md:justify-between items-center gap-4 sm:gap-8 mt-6 sm:mt-8">
        <WarningButton onClick={onDeleteModule} size="lg">
          Delete
        </WarningButton>
        <div className="flex gap-8 flex-wrap">
          <MainButton onClick={handleClose} size="lg" standardWidth>
            Cancel
          </MainButton>
          <MainButton
            onClick={handleSave}
            solid
            disabled={saving}
            size="lg"
            standardWidth
          >
            {saving
              ? (
                <span className="inline-block">
                  <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                </span>
              )
              : "Save"
              }
          </MainButton>
        </div>
      </div>

    </Modal>
  )
}

const EditArtItem = ({
  width, height,
  token,
  onRemove
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
      <div
        className="relative duration-300 w-fit mx-auto"
      >
        <div
          className='relative block w-fit duration-300'
          style={{
            height,
            width,
          }}
        >
          <button
            className={clsx(
              "absolute -top-2 -right-2 z-50 p-1",
              "bg-neutral-300/50 dark:bg-neutral-700/50 rounded-full shadow-md",
              "duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700",
            )}
            onClick={onRemove}
          >
           <Icon.X />
          </button>
          <CloudinaryImage
            className={clsx(
              "object-cover",
              "shadow-md rounded-lg",
              "w-full h-full"
            )}
            width={500}
            useMetadataFallback
            token={token}
            noLazyLoad
            onLoad={() => setLoaded(true)}
          />
          {!loaded ? <p className="animate-pulse p-4">Loading...</p> : null}
        </div>
      </div>

  )
}
