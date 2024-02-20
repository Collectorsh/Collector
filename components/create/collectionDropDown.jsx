import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import MainButton from '../MainButton'
import CreateCollectionModal from './createCollectionModal'
import { Oval } from 'react-loader-spinner'
import Tippy from '@tippyjs/react'

import * as Icon from 'react-feather'

const CollectionDropDown = ({ selectedCollection, setCollection, setError, existingCollections }) => {
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [collections, setCollections] = useState(undefined)

  useEffect(() => {
    if (existingCollections) setCollections(existingCollections)
  }, [existingCollections])

  const openCollectionModal = () => setCollectionModalOpen(true)

  const handleChange = (collection) => {
    setCollection(collection)
    // setError(prev => ({ ...prev, collection: null }))
  }

  const info = (
    <Tippy
      content="Onchain collections help organize your art into series with provenance"
    >
      <Icon.Info size={14} className="opacity-50" />
    </Tippy>
  )

  return (
    <div className="relative mb-4 w-full">
      <CreateCollectionModal isOpen={collectionModalOpen} onClose={() => setCollectionModalOpen(false)} setCollections={setCollections} />
      <p className="font-bold text-lg mb-1 ml-3 flex gap-1">
        Collection
        {info}
      </p>
      <Listbox value={selectedCollection} onChange={handleChange}>
        {({ open }) => (
          <>
            <Listbox.Button className="text-current 
                    w-full h-fit flex justify-between items-center
                    px-3.5 py-2 outline-none rounded-md border-2 bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hoverPalette1
                  "
            >
              {selectedCollection ? (
                <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedCollection.image} alt="" className="w-8 h-8 absolute left-4 rounded" />
                <p className='ml-12'>{selectedCollection.name}</p>
                </div>
              )
                : "Select a Collection"
              }
              
              <Icon.ChevronDown size={20} strokeWidth={2.5} className={clsx("duration-300", open && "rotate-180")} />
            </Listbox.Button>
            <Transition
              className="relative z-10"
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="mt-2 absolute top-0 left-0 w-full palette2 p-2 rounded shadow z-30">
                <div className='h-fit max-h-[10rem] overflow-auto'>
                  <Listbox.Option key="none" value={null}>
                    <div className={clsx(
                      "p-2 flex gap-1 items-center justify-between w-full cursor-pointer rounded",
                      'hoverPalette2'
                    )}>No Associated Collection</div>
                  </Listbox.Option>
                  {collections
                    ? collections?.map((collection) => (
                    <Listbox.Option key={collection.mint} value={collection}>
                        <div
                          className={clsx(
                            "p-2 flex gap-1 items-center justify-between w-full cursor-pointer rounded",
                            'hoverPalette2' 
                          )}
                        >
                          <div className='flex gap-1 items-center'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={collection.image} alt="" className="w-8 h-8 rounded" />
                            {collection.name}
                          </div>
                          {selectedCollection?.mint === collection.mint ? <CheckIcon className="w-6 h-6 float-right" /> : null}
                        </div>
                    </Listbox.Option>
                    ))
                    : (
                      <div className="flex w-full justify-center">
                        <Oval color="#FFF" secondaryColor="#666" strokeWidth={2.5} height={24} width={24} />
                      </div>
                    )
                }
                </div>
                <MainButton
                  // noPadding
                  onClick={openCollectionModal}
                  className="w-full flex items-center justify-center gap-1.5 mt-3"
                >
                  New Collection 
                  <Icon.Plus size={20} strokeWidth={2.5}/>
                </MainButton>
              
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default CollectionDropDown