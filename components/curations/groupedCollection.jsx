import { useMemo } from "react"
import AddTokenButton from "./addTokenButton"
import { Disclosure, Transition } from "@headlessui/react"


const GroupedCollection = ({
  collection,
  makeTokenButtons
}) => {
  const groupedTokens = makeTokenButtons(collection.tokens)
  return (
    <Disclosure as="div" className="row-span-full w-full" >
      <Disclosure.Button>{collection.name}</Disclosure.Button>

      <Transition
        className=""
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Disclosure.Panel className="grid gap-4 rounded-lg grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {groupedTokens}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  )
} 

export default GroupedCollection