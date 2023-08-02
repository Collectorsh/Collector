import {useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useMetadata } from "../../data/nft/getMetadata";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import SearchBar from "../SearchBar";
import { RoundedCurve } from "./roundedCurveSVG";
import { set } from "nprogress";

const tabs = ["submitted", "owned"]

export default function EditBannerModal({ isOpen, onClose, onSave, submittedTokens }) {
  const [user] = useContext(UserContext);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(134);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const tokens = useMetadata(user?.public_keys, {
    useArtistDetails: false,
    justVisible: false
  });

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      if(!currentTab) return
      setTabUnderlineLeft(currentTab.offsetLeft);
      setTabUnderlineWidth(currentTab.clientWidth);
    }
    setTabPosition()
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  const handleSave = () => { 
    onSave(selected);
    onClose();
    setTimeout(() => setSearch(""), 500);
  }
  const handleClose = () => { 
    onClose();
    setTimeout(() => {
      setSearch("")
      setSelected(null);
    }, 500);
  }

  const searchFilter = useCallback((token) => {
    const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
    const artistNameMatch = token.artist_name?.toLowerCase().includes(search.toLowerCase())
    return search ? (artNameMatch || artistNameMatch) : true;
  },[search])

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;
    
    const visible = tokens.filter((token) => {
      return token.visible && token.optimized === "True" && searchFilter(token);
    });
    const hidden = tokens.filter((token) => {
      return !token.visible && token.optimized === "True" && searchFilter(token);
    });
    return [...visible, ...hidden];
  }, [tokens, searchFilter])

  const gridColumns = "grid-cols-1 md:grid-cols-2";
  
  const ownedContent = orderedTokens
    ? (
      <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className={clsx("w-full h-[532px] p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
          {orderedTokens.map((token, i) => {
            const isSelected = selected?.mint === token.mint;
            return (
              <button className="relative flex justify-center flex-shrink-0" key={token.mint}
                onClick={() => setSelected(isSelected ? null : token)}
              >
                <CloudinaryImage
                  className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
                    "w-full h-[250px] rounded-lg",
                    isSelected && "ring-4 ring-black dark:ring-white"
                  )}
                  id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
                  mint={token.mint}
                  width={800}
                />
              </button>
            )
          })}
        </div>
      </div>
    )
    : (
      <div className="h-[532px] max-h-full flex items-center justify-center">
        <p className="animate-pulse">Gathering your digital assets...</p>
      </div>
    )

  const submittedContent = (
    <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <div className={clsx("w-full h-[532px] p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
        {submittedTokens?.filter(searchFilter).map((token, i) => {
          const isSelected = selected?.mint === token.mint;
          return (
            <button className="relative flex justify-center flex-shrink-0" key={token.mint}
              onClick={() => setSelected(isSelected ? null : token)}
            >
              <CloudinaryImage
                className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
                  "w-full h-[250px] rounded-lg",
                  isSelected && "ring-4 ring-black dark:ring-white"
                )}
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
                mint={token.mint}
                width={800}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
  
  const tabContent = [submittedContent, ownedContent]

  if(!user) return null
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit The Gallery Banner">
      <SearchBar
        className="ml-2 pl-4 w-full max-w-[20rem] mt-8"
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
                {tab} Art
              </button>
            )
          })}
        
        </div>
        <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]"  />
        <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700"/>
        <span
          className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner shadow-black/10 dark:shadow-white/10"
        />
        <span
          className="absolute rounded-full bottom-0 block h-1 bg-black dark:bg-white transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </div>
      
      {tabContent[activeTabIndex]}
      <div className="w-full flex justify-end gap-4 mt-4">
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid disabled={!selected}>
          Save
        </MainButton>
      </div>

    </Modal>
  )
}
