import {useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useTokens } from "../../data/nft/getTokens";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal, { modalActionDivClass } from "../Modal";
import SearchBar from "../SearchBar";
import { useImageFallbackContext } from "../../contexts/imageFallback";
import { RoundedCurve } from "../curations/roundedCurveSVG";
import FileDrop, { cleanFileName } from "../FileDrop";
import { customIdPrefix } from "../../utils/cloudinary/idParsing";
import uploadCldImage from "../../data/cloudinary/uploadCldImage";
import { error } from "../../utils/toast";

const uploadTabTitle = "Upload"
const tabs = [
  uploadTabTitle,
  "Owned Art"
]

export default function EditImageModal({ title, isOpen, onClose, onSave, type }) {
  const [user] = useContext(UserContext);
  const { uploadSingleToken } = useImageFallbackContext()
  
  const { tokens, loading } = useTokens(user?.public_keys, {
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

  const isBanner = type === "banner";
  const isPfp = type === "pfp";

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

  const handleSave = async () => {
    if (saveDisabled) return
    setSaving(true)
    if (tabs[activeTabIndex] === uploadTabTitle) {
      //Handle custom Uploads
      const typeFolder = `gallery-${isBanner ? "banner" : "pfp"}`

      const cldId = `${ customIdPrefix }/${typeFolder}/${ user.username.replace(" ", "_") }-${ imageFileName }`
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

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;
    const searchFilter = (token) => {
      const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
      const artistNameMatch = token.artist_name?.toLowerCase().includes(search.toLowerCase())
      const mintAddressMatch = token.mint.toLowerCase() == search.toLowerCase()
      return search ? (artNameMatch || artistNameMatch || mintAddressMatch) : true;
    }
    const visible = tokens.filter((token) => {
      return token.visible && searchFilter(token);
    });
    const hidden = tokens.filter((token) => {
      return !token.visible && searchFilter(token);
    });
    return [...visible, ...hidden];
  }, [tokens, search])

  const gridColumns = useMemo(() => {
    switch (type) { 
      case "banner": return "grid-cols-1 md:grid-cols-2";
      case "pfp": return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    }
  }, [type])

  const ownedContent = orderedTokens
    ? (
      <div className={clsx("w-full h-full p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
        {orderedTokens.map((token, i) => {
          const isSelected = selected?.mint === token.mint;
          return (
            <button
              className={clsx("relative flex flex-shrink-0 justify-center ", isBanner ? "pb-[33%] w-full" : "h-[150px] w-[150px] md:h-[200px] md:w-[200px]")}
              key={token.mint}
              onClick={() => setSelected(isSelected ? null : token)}
            >
              <CloudinaryImage
                className={clsx("flex-shrink-0 overflow-hidden object-cover shadow hover:shadow-md",
                  "absolute inset-0 w-full h-full",
                  isPfp ? "rounded-full " : "rounded-lg",
                  isSelected && "ring-4 ring-neutral-700 dark:ring-neutral-300",
                )}
                useMetadataFallback
                token={token}
                width={isBanner ? 800 : 500}
              />
            </button>
          )
        })}
      </div>
    )
    : (
      <div className="h-full flex items-center justify-center">
        <p className="animate-pulse">Gathering your digital assets...</p>
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
        imageClass={isPfp ? "object-cover rounded-full max-h-[250px] max-w-[250px] md:max-h-[450px] md:max-w-[450px]" : undefined}
        onDrop={onDrop}
        helperText={isBanner ? "Recommended resolution 1500x500" : undefined}
      />
    </div>
  )

  const tabContent = [
    uploadComp,
    ownedContent
  ]

  if(!user) return null
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
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

            return (
              <button
                key={tab}
                ref={(el) => (tabsRef.current[i] = el)}
                className={clsx(
                  "px-3 py-0 my-1 capitalize font-bold duration-300",
                  "hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded"
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
          className="absolute rounded-full bottom-0 block h-1 bg-neutral-700 dark:bg-neutral-300  transition-all duration-300"
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