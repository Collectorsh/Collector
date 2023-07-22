import {useContext, useEffect, useMemo, useState } from "react";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useMetadata } from "../../data/nft/getMetadata";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import Modal from "../Modal";
import SearchBar from "../SearchBar";

export default function EditImageModal({ title, isOpen, onClose, onSave, type }) {
  const [user] = useContext(UserContext);
  const tokens = useMetadata(user?.public_keys, {
    useArtistDetails: false,
    justVisible: false
  });

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const isBanner = type === "banner";
  const isPfp = type === "pfp";

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

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;
    const searchFilter = (token) => {
      const artNameMatch = token.name.toLowerCase().includes(search.toLowerCase())
      const artistNameMatch = token.artist_name?.toLowerCase().includes(search.toLowerCase())
      return search ? (artNameMatch || artistNameMatch) : true;
    }
    const visible = tokens.filter((token) => {
      return token.visible && token.optimized === "True" && searchFilter(token);
    });
    const hidden = tokens.filter((token) => {
      return !token.visible && token.optimized === "True" && searchFilter(token);
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

  if(!user) return null
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <SearchBar
        className="pl-4 w-full max-w-[20rem] mt-6"
        search={search}
        setSearch={setSearch}
        placeholder="Search By Artwork"
      />
      {orderedTokens
        ? (
          <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <div className={clsx("w-full h-[532px] p-2 overflow-auto grid gap-4 rounded-lg", gridColumns)}>
              {orderedTokens.map((token, i) => { 
                const isSelected = selected?.mint === token.mint;
                return (
                  <button className="relative flex justify-center flex-shrink-0" key={token.mint}
                    onClick={() => setSelected(isSelected ? null : token)}
                  >
                    <CloudinaryImage
                      className={clsx("flex-shrink-0 overflow-hidden object-cover shadow-lg dark:shadow-white/5",
                        isPfp ? "rounded-full h-[150px] w-[150px] md:h-[200px] md:w-[200px]" : "w-full h-[250px] rounded-lg",
                        isSelected && "ring-4 ring-black dark:ring-white"
                      )}
                      id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
                      mint={token.mint}
                      width={isBanner ? 800 : 500}
                    />
                  </button>
                )
              })}
            </div>
          </div>

        )
        : <div className="h-[532px] flex items-center justify-center">
          <p className="animate-pulse">Gathering your digital assets...</p>
        </div>
        }
      
      <div className="w-full flex justify-end gap-4">
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