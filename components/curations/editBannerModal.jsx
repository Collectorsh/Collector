import {useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useTokens } from "../../data/nft/getTokens";
import CloudinaryImage, { IMAGE_FALLBACK_STAGES } from "../CloudinaryImage";
import clsx from "clsx";
import Modal, { modalActionDivClass } from "../Modal";
import SearchBar from "../SearchBar";
import { RoundedCurve } from "./roundedCurveSVG";
import { useImageFallbackContext } from "../../contexts/imageFallback";
import FileDrop, { cleanFileName } from "../FileDrop";
import { customIdPrefix } from "../../utils/cloudinary/idParsing";
import uploadCldImage from "../../data/cloudinary/uploadCldImage";
import { error } from "../../utils/toast";
import { truncate } from "../../utils/truncate";
import { groupEditions } from "../../utils/groupEditions";
import Tippy from "@tippyjs/react";

const uploadTabTitle = "Upload"
const submittedTabTitle = "Submitted Art"
const tabs = [
  uploadTabTitle,
  submittedTabTitle,
  "Owned Art"
]

export default function EditBannerModal({ isOpen, onClose, onSave, submittedTokens, curation }) {
  const [user] = useContext(UserContext);
  const { uploadSingleToken } = useImageFallbackContext()
  const isArtistCuration = curation.curation_type === "artist"
  const { tokens, loading, current, total } = useTokens(user?.public_keys, {
    queryByCreator: isArtistCuration,
    useTokenMetadata: isArtistCuration,
    useArtistDetails: false,
    justVisible: false
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(80);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveDisabled = (tabs[activeTabIndex] === uploadTabTitle ? !imageBuffer : !selected) || saving

  const isPersonalCuration = curation?.curation_type !== "curator" //"artist" || "collector"
  const loadingCounter = total ? ` (${ current }/${ total })` : "..."

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      if(!currentTab) return
      setTabUnderlineLeft(currentTab.offsetLeft);
      setTabUnderlineWidth(currentTab.clientWidth);
    }
    setTimeout(setTabPosition, 0); //wait for DOM to render before setting tab position
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  const handleSave = async () => { 
    if (saveDisabled) return
    setSaving(true)
    if (tabs[activeTabIndex] === uploadTabTitle) {
      //Handle custom Uploads
      const cldId = `${customIdPrefix}/curation-banner/${curation.id}-${imageFileName}`
      const res = await uploadCldImage({
        imageBuffer,
        cldId: cldId
      })
      if (res?.public_id) {
        onSave(res.public_id); //will be same as cldId if uploaded correctly
      } else {
        error("Error uploading image")
        console.log("Error uploading image: ", res?.error)
        setSaving(false)
        return
      }
    } else {
      //Handle token image uploads
      await uploadSingleToken(selected)
      onSave(selected);
    }

    setSaving(false)
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

  const onDrop = useCallback((imageFile) => {
    setImageFileName(cleanFileName(imageFile.name));
    
    const reader = new FileReader();
    reader.onloadend = () => setImageBuffer(Buffer.from(reader.result));
    reader.readAsDataURL(imageFile);
  }, []);

  const searchFilter = useCallback((token) => {
    const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
    const artistNameMatch = token.artist_name?.toLowerCase().includes(search.toLowerCase())
    const mintAddressMatch = token.mint.toLowerCase() == search.toLowerCase()
    return search ? (artNameMatch || artistNameMatch || mintAddressMatch) : true;
  },[search])

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;
    const editions = groupEditions(tokens.filter(searchFilter).filter(token => token.is_edition))
    const others = tokens.filter(searchFilter).filter(token => !token.is_edition)
    return [...others, ...editions]
  }, [tokens, searchFilter])

  const gridColumns = "grid-cols-1 md:grid-cols-2";
  
  const ownedContent = orderedTokens
    ? (
      <div className={clsx("w-full h-full p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
        {orderedTokens.map((token, i) => {
          const isSelected = selected?.mint === token.mint;
          return <TokenItem key={token.mint} token={token} isSelected={isSelected} setSelected={setSelected}/>
        })}
      </div>
    )
    : (
      <div className="h-full flex items-center justify-center">
        <p className="animate-pulse">Gathering your digital assets {loadingCounter}</p>
      </div>
    )

  const submittedContent = (
    <div className={clsx("w-full h-full p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
      {submittedTokens?.filter(searchFilter).map((token, i) => {
        const isSelected = selected?.mint === token.mint;
        return (
          <button className="relative flex flex-shrink-0 pb-[33%] w-full" key={token.mint}
            onClick={() => setSelected(isSelected ? null : token)}
          >
            <CloudinaryImage
              className={clsx("flex-shrink-0 overflow-hidden object-cover shadow hover:shadow-md",
                "w-full h-full rounded-lg",
                isSelected && "ring-4 ring-neutral-700 dark:ring-neutral-300",
                "absolute inset-0"
              )}
              useMetadataFallback
              useUploadFallback
              token={token}
              width={800}
            />
          </button>
        )
      })}
    </div>
  )

  const uploadComp = (
    <div className="p-2 rounded-lg h-full w-full relative">
      {saving ? (
        <div className="absolute inset-0 z-50 backdrop-blur-sm bg-neutral-200/50 dark:bg-neutral-700/50 animate-pulse flex justify-center items-center h-full">
          <p className="text-lg">Uploading...</p>  
        </div>
      ) : null}
      <FileDrop
        onDrop={onDrop}
        helperText={"Recommended resolution 1500x500"}
        />
    </div>
  )
  
  const tabContent = [
    uploadComp,
    submittedContent,
    ownedContent
  ]

  if(!user) return null
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit The Gallery Banner">
      <SearchBar
        className="pl-4 w-full max-w-[20rem] mt-4 mb-3 lg:mb-0 bg-neutral-200 dark:bg-neutral-900"
        search={search}
        setSearch={setSearch}
        placeholder="Search By Artwork"
      />

      <div className="relative mx-auto w-fit">
        <div className="flex justify-center space-x-2 border-b-8 borderPalette3">
          {tabs.map((tab, i) => {
            const handleClick = () => {
              setActiveTabIndex(i);
            }
            const isSelected = activeTabIndex === i;

            if (isPersonalCuration && tab === submittedTabTitle) return null;

            const tabTitle = isArtistCuration && tab === "Owned Art" ? "Created Art" : tab

            return (
              <button
                key={tab}
                ref={(el) => (tabsRef.current[i] = el)}
                className={clsx(
                  "px-3 py-0 my-1 capitalize  font-bold duration-300",
                  "hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded"
                )}
                onClick={handleClick}
              >
                {tabTitle}
              </button>
            )
          })}
        
        </div>
        <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1]"  />
        <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-neutral-300 dark:fill-neutral-700"/>
        <span
          className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner palette2 shadow-black/10 dark:shadow-white/10"
        />
        <span
          className="absolute rounded-full bottom-0 block h-1 bg-neutral-700 dark:bg-neutral-300 transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </div>
      <div className="h-[540px] max-h-full border-4 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 borderPalette3">
        {tabContent[activeTabIndex]}
      </div>
      <div className={modalActionDivClass}>
        <MainButton onClick={handleClose} size="lg" standardWidth>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid disabled={saveDisabled} size="lg" standardWidth>
          Save
        </MainButton>
      </div>

    </Modal>
  )
}

const TokenItem = ({ token , isSelected, setSelected}) => {
  const [error, setError] = useState(false)
  const handleError = (e) => {
    if (e === IMAGE_FALLBACK_STAGES.METADATA) {
      setError(true)
    }
  }
  return (
    <button
      className={clsx("relative flex justify-center flex-shrink-0", error && "hidden")}
      key={token.mint}
      onClick={() => setSelected(isSelected ? null : token)}
      disabled={error}
    >
      {error ? (
        <div
          className="absolute text-center inset-0 p-8 w-full h-full overflow-hidden bg-neutral-200/90 dark:bg-neutral-800/90  
             flex flex-col justify-center items-center rounded-lg z-20
          "
        >
          <p>Error loading metadata image</p>
          <Tippy content="View token on Solscan" className="shadow">
            <a
              className="hover:bg-neutral-400 dark:hover:bg-neutral-600 rounded-md px-2 duration-300"
              href={`https://solscan.io/token/${ token.mint }`}
              target="_blank"
              rel="noreferrer"
            >
              {truncate(token.mint)}
            </a>

          </Tippy>
        </div>
      ) : null}

      <div className="pb-[33%] relative w-full">
        <CloudinaryImage
          className={clsx("flex-shrink-0 overflow-hidden object-cover shadow hover:shadow-md",
            "w-full h-full rounded-lg",
            isSelected && "ring-4 ring-neutral-700 dark:ring-neutral-300",
            error && "z-0",
            "absolute inset-0"
          )}
          useMetadataFallback
          token={token}
          width={800}
          onError={handleError}
        />

      </div>

      
    </button>
  )
}