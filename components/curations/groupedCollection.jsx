import { useMemo } from "react"
import AddTokenButton from "./addTokenButton"
import { Disclosure, Transition } from "@headlessui/react"


const GroupedCollection = ({
  collection,
  tokenMintsInUse,
  useUserTokens,
  tokens,
  newArtModule,
  setNewArtModule,
  moduleFull,
  handleTokenToSubmit,
  curationType,
}) => {
  const groupedTokens = collection.tokens.map((token, i) => {
      const inUseHere = tokens.findIndex(t => t.mint === token.mint) >= 0 //in this module currently
      const inUseElseWhere = false;
      Object.entries(tokenMintsInUse).forEach(([moduleId, mints]) => { //used in other modules
        if (moduleId === newArtModule.id) return;
        if (mints.includes(token.mint)) inUseElseWhere = true;
      });

      const alreadyInUse = inUseHere || inUseElseWhere;

      const artistUsername = useUserTokens
        ? token.artist_name
        : approvedArtists.find(artist => artist.id === token.artist_id).username;

      return (
        <AddTokenButton
          key={`token-${ token.mint }`}
          token={token}
          alreadyInUse={alreadyInUse}
          artistUsername={artistUsername}
          moduleFull={moduleFull}
          handleTokenToSubmit={handleTokenToSubmit}
          setNewArtModule={setNewArtModule}
          curationType={curationType}
        />
      )
  })

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