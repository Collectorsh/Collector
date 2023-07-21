import { Fragment, useContext, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/outline";
import MainButton from "../MainButton";
import UserContext from "../../contexts/user";
import { useMetadata } from "../../data/nft/getMetadata";
import CloudinaryImage from "../CloudinaryImage";

import { FixedSizeGrid as Grid } from 'react-window';
import clsx from "clsx";

export default function EditImageModal({ title, isOpen, onClose, onSave, type }) {
  const [user] = useContext(UserContext);
  const tokens = useMetadata(user?.public_keys, { useArtistDetails: false });

  const [selected, setSelected] = useState(null);

  const isBanner = type === "banner";
  const isPfp = type === "pfp";

  const orderedTokens = useMemo(() => {
    if (!tokens) return null;
    const visible = tokens.filter((token) => token.visible && token.optimized === "True");
    const hidden = tokens.filter((token) => !token.visible && token.optimized === "True");
    return [...visible, ...hidden];
  }, [tokens])

  const gridColumns = useMemo(() => {
    switch (type) { 
      case "banner": return "grid-cols-1 md:grid-cols-2";
      case "pfp": return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    }
  }, [type])

  if(!user) return null
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="z-[100] relative w-screen h-screen dark:text-white">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="p-2 fixed inset-0 w-screen h-screen flex justify-center items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-10"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-10"
          >
            <Dialog.Panel
              className="relative p-4 w-full max-w-screen-xl max-h-[calc(100%-10rem)] rounded-lg bg-white dark:bg-neutral-800 shadow-lg"
            >
              <button onClick={onClose} className="absolute top-2 right-2 duration-200 hover:scale-105 active:scale-100">
                <XCircleIcon className="w-8 h-8" />
              </button>
              <Dialog.Title className="text-center font-bold text-3xl">{title}</Dialog.Title>
              <div>
                search bar
              </div>
              {orderedTokens
                ? (
                  <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <div className={clsx("w-full h-[532px] p-2 overflow-auto grid gap-4 rounded-lg items-center", gridColumns)}>
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
                              // noLazyLoad
                              width={500}
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                )
                : <div>
                  <p className="animate-pulse text-center">Gathering your digital assets...</p>
                </div>
                }
              
              <div className="w-full flex justify-end gap-4">
                <MainButton onClick={onClose}>
                  Cancel
                </MainButton>
                <MainButton onClick={onSave} solid disabled={!selected}>
                  Save
                </MainButton>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}