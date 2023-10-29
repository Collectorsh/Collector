import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import MainButton from '../MainButton'
import CreateCollectionModal from './createCollectionModal'
import { Oval } from 'react-loader-spinner'

const CollectionDropDown = ({ selectedCollection, setCollection, setError, existingCollections }) => {
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [collections, setCollections] = useState(undefined)

  useEffect(() => {
    if (existingCollections) setCollections(existingCollections)
  }, [existingCollections])

  const openCollectionModal = () => setCollectionModalOpen(true)

  const handleChange = (collection) => {
    setCollection(collection)
    setError(prev => ({ ...prev, collection: null }))
  }

  return (
    <div className="relative mb-4 w-full">
      <CreateCollectionModal isOpen={collectionModalOpen} onClose={() => setCollectionModalOpen(false)} setCollections={setCollections} />
      <p className="font-bold text-lg mb-1 ml-3">Collection*</p>
      <Listbox value={selectedCollection} onChange={handleChange}>
        <Listbox.Button className="text-current border-4 
                rounded-xl border-neutral-200 dark:border-neutral-700 
                bg-neutral-100 dark:bg-neutral-900
                w-full h-fit p-3 flex justify-between items-center
              "
        >
          {selectedCollection ? (
            <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedCollection.image} alt="" className="w-10 h-10 absolute left-4" />
            <p className='ml-12'>{selectedCollection.name}</p>
            </div>
          )
            : "Select a Collection"
          }
          
          <ChevronDownIcon className="w-5 h-5" />
        </Listbox.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className="absolute top-0 left-0 w-full bg-white dark:bg-black p-2 rounded-lg shadow z-30">
            <div className='h-fit max-h-[10rem] overflow-auto'>
              {collections
                ? collections?.map((collection) => (
                <Listbox.Option key={collection.mint} value={collection}>
                    <div
                      className={clsx(
                        "p-2 flex gap-1 items-center justify-between w-full cursor-pointer rounded",
                        'hover:bg-neutral-500/25' 
                      )}
                    >
                      <div className='flex gap-1 items-center'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collection.image} alt="" className="w-10 h-10" />
                        {collection.name}
                      </div>
                      {selectedCollection?.mint === collection.mint ? <CheckIcon className="w-6 h-6 float-right" /> : null}
                    </div>
                </Listbox.Option>
                ))
                : (
                  <div className="flex w-full justify-center">
                    <Oval color="#FFF" secondaryColor="#666" height={24} width={24} />
                  </div>
                )
            }
            </div>
            <MainButton
              noPadding
              onClick={openCollectionModal}
              className="p-1 w-full flex items-center justify-center gap-2 hover:scale-100 mt-3"
            >
              New Collection <PlusIcon className="inline-block w-5 h-5" />
            </MainButton>
           
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

export default CollectionDropDown