import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MainButton from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import { RoundedCurve } from "../curations/roundedCurveSVG";
import { XIcon } from "@heroicons/react/solid";
import { Oval } from "react-loader-spinner";

const tabs = ["1/1", "Editions"]

export default function SubmitArtModal({ isOpen, onClose, onSubmit, curation, tokens }) {
  console.log("🚀 ~ file: submitArtModal.jsx:13 ~ SubmitArtModal ~ tokens:", tokens)
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const curationName = curation?.name.replaceAll("_", " ")


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

  const ownedContent = useMemo(() => {
    if (!tokens) return null
    return tokens.map((token) => (
      <ArtworkItem
        key={token.mint}
        token={token}
        submittedTokens={curation?.submitted_token_listings}
        selectedTokens={selectedTokens}
        setSelectedTokens={setSelectedTokens}
      />
    ))
  }, [tokens, selectedTokens, curation?.submitted_token_listings])
        

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Submit Artworks`}>
      <p className="mt-4 text-lg font-bold text-center">Choose the pieces you would like to submit to {curationName}</p>
      <p className="text-center mb-8">Your curator {curation?.curator.username} will receive {curation?.curator_fee}% of the sale price</p>

      <div className="border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className={clsx("w-full h-[266px] p-2 overflow-auto grid gap-4 rounded-lg",
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
              onRemove={() => setSelectedTokens(prev => prev.filter(a => a.mint !== token.mint))}
            />
          )
        })}
      </div>

      <p className="text-center font-bold h-12">{selectedTokens.length ? "Once you've submitted, click the 'Edit Listings' button to list your pieces!": ""}</p>
      
      <div className="w-full flex justify-end gap-4 relative">
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

const ArtworkItem = ({ token, submittedTokens, selectedTokens, setSelectedTokens}) => {
  const imageRef = useRef(null)
  const alreadySubmitted = submittedTokens?.find(t => t.mint === token.mint)
  const index = selectedTokens.findIndex((t) => t.mint === token.mint);
  const isSelected = index !== -1;

  const getAspectRatio = (imageElement) => {
    return Number(imageElement.naturalWidth / imageElement.naturalHeight)
  }

  const handleClick = () => {
    if (!imageRef.current) return
    const newToken = { ...token }

    newToken.aspectRatio = getAspectRatio(imageRef.current)
    setSelectedTokens(prev => {
      if (!isSelected) return [...prev, newToken];
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
        imageRef={imageRef}
        className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
          "w-full h-[250px] rounded-lg",
          isSelected && "ring-4 ring-black dark:ring-white",
          alreadySubmitted && "opacity-50 blur-[2px]"
        )}
        // id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
        // mint={token.mint}
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