import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useState } from 'react'
import MainButton from '../MainButton'

const CollectionDropDown = ({ selectedCollection, setCollection, setError }) => {
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const collections = [
    { name: "test", mint: "12345", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
    { name: "test2", mint: "123456", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
    { name: "test3", mint: "1234567", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
    { name: "test", mint: "12345", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
    { name: "test2", mint: "123456", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
    { name: "test3", mint: "1234567", image: "https://arweave.net/QBm89KHKmJGw4fk35UeTiCnsUrBQy6emNe5FlNiS5ic?ext=png" },
  ]

  const openCollectionModal = () => setCollectionModalOpen(true)

  const handleChange = (collection) => {
    setCollection(collection)
    setError(prev => ({ ...prev, collection: null }))
  }

  return (
    <div className="relative mb-4 w-full">
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
              {collections.map((collection) => (
                <Listbox.Option key={collection.mint} value={collection}>
                 
                    <li
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
                      
                    </li>
             
                </Listbox.Option>
              ))}
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