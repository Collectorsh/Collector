import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useMetadata } from "../../data/nft/getMetadata";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import SearchBar from "../SearchBar";
import { RoundedCurve } from "../proGallery/roundedCurveSVG";
import { XIcon } from "@heroicons/react/solid";

export default function SubmitArtModal({ isOpen, onClose, onSubmit, gallery }) {
  const [user] = useContext(UserContext);

  const tokens = useMetadata(user?.public_keys, {
    useArtistDetails: false,
    justVisible: false,
    // justCreator: true // TODO: add this filter or create new route for just creator and owned tokens
  });

  const [selectedTokens, setSelectedTokens] = useState([]);
  const [search, setSearch] = useState("");


  const galleryName = gallery?.name.replaceAll("_", " ")


  const clearState = () => {
    setTimeout(() => {
      setSearch("")
      setSelectedTokens([]);
    }, 500);
  }

  const handleSubmit = async () => {
    onSubmit(gallery, selectedTokens);
    onClose();
    clearState()
  }

  const handleClose = () => {
    onClose();
    clearState()
  }

  const searchFilter = useCallback((token) => {
    const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
    return search ? artNameMatch : true;
  }, [search])

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;

    //TODO: might need to remove this if createing new token fetch method
    const visible = tokens.filter((token) => {
      return token.visible && token.optimized === "True" && searchFilter(token);
    });
    const hidden = tokens.filter((token) => {
      return !token.visible && token.optimized === "True" && searchFilter(token);
    });
    return [...visible, ...hidden];
  }, [tokens, searchFilter])

  const ownedContent = orderedTokens
    ? (
      <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className={clsx("w-full h-[266px] p-2 overflow-auto grid gap-4 rounded-lg",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {orderedTokens.map((token) => {
            const alreadySubmitted = gallery?.submitted_tokens?.find(t => t.mint === token.mint)
            const index = selectedTokens.findIndex((t) => t.mint === token.mint);
            const isSelected = index !== -1;
            const handleClick = () => {
              setSelectedTokens(prev => {
                if (!isSelected) return [...prev, token];
                return [...prev.slice(0, index), ...prev.slice(index + 1)];
              })
            }

            return (
              <button className="relative flex justify-center flex-shrink-0 disabled:scale-100"
                key={token.mint}
                onClick={handleClick}
                disabled={alreadySubmitted}
              >
                <CloudinaryImage
                  className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
                    "w-full h-[250px] rounded-lg",
                    isSelected && "ring-4 ring-black dark:ring-white",
                    alreadySubmitted && "opacity-50 blur-[2px]"
                  )}
                  id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
                  mint={token.mint}
                  width={800}
                />
                {alreadySubmitted
                  ? <p
   
                    className="absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] z-50 shadow-lg
                  bg-neutral-200/50 dark:bg-neutral-800/50 px-5 py-2 rounded-lg font-bold"
                    >
                    Already Submitted</p>
                  : null}
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

  if (!user) return null
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Submit Artworks`}>
      <p className="mt-4 text-lg font-bold text-center">Choose the pieces you would like to submit to {galleryName}</p>

      <SearchBar
        className="ml-2 pl-4 w-full max-w-[20rem] mt-4 mb-2"
        search={search}
        setSearch={setSearch}
        placeholder="Search By Artwork Name"
      />

      {ownedContent}

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
              onRemove={() => setSelectedTokens(prev => prev.filter(a => a.mint !== token.mint))}
            />
          )
        })}
      </div>

      <p className="text-center font-bold h-6">{selectedTokens.length ? "Once you've submitted, click the 'Edit Submission Listings' button to list your pieces!": ""}</p>
      
      <div className="w-full flex justify-end gap-4 mt-4 relative">
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleSubmit} solid disabled={!selectedTokens.length}>
          Submit!
        </MainButton>
      </div>

    </Modal>
  )
}


const ArtChip = ({ name, onRemove }) => {
  return (
    <div className="flex items-center gap-1 rounded-lg pl-2 pr-1
    bg-white dark:bg-black
      border border-neutral-200 dark:border-neutral-700
    ">
      <p>{name}</p>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 hover:scale-110 active:scale-100 duration-300">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}