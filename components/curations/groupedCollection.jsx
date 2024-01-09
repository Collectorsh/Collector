import { useState } from "react"
import { Disclosure, Transition } from "@headlessui/react"
import { metaPreviewImage } from "../../config/settings"
import clsx from "clsx"
import ContentLoader from "react-content-loader"


const GroupedCollection = ({
  collection,
  makeTokenButtons
}) => {
  //if no image set to loaded
  const [imageLoaded, setImageLoaded] = useState(!collection.image)
  const [imageSrc, setImageSrc] = useState(collection.image)
  const groupedTokens = makeTokenButtons(collection.tokens)

  const onImageError = () => { 
    setImageSrc(null)
    setImageLoaded(true)
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={clsx('flex gap-2 items-center rounded-lg h-fit', open && "ring-2 ring-neutral-300 dark:ring-neutral-700")}>


            <div className="w-20 h-20 flex-shrink-0 relative">
              <ContentLoader
                speed={2}
                className={clsx(
                  "w-full h-full rounded-lg",
                  "absolute z-10 top-0 left-0",
                  imageLoaded ? "opacity-0" : "opacity-100"
                )}
                backgroundColor="rgba(120,120,120,0.2)"
                foregroundColor="rgba(120,120,120,0.1)"
              >
                <rect className="w-full h-full" />
              </ContentLoader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {imageSrc ? (<img
                  src={imageSrc}
                  alt=""
                className={clsx(
                    "h-full w-full",
                    "object-cover rounded-lg duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={onImageError}
                />
              ) : (
                  <div className=" w-full h-full flex justify-center items-center rounded-lg bg-white dark:bg-black">

                    <p className="collector text-6xl font-bold mb-3">c</p>
                  </div>
              )}
            </div>
            
            <p className="font-bold text-left overflow-hidden">{collection.name}</p>
          </Disclosure.Button>

          <Transition
            className="col-span-full w-full"
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="grid gap-4 rounded-lg grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <hr className="col-span-full border-neutral-200 dark:border-neutral-700" />
              {groupedTokens}
              <hr className="col-span-full border-neutral-200 dark:border-neutral-700" />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
} 

export default GroupedCollection