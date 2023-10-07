import MainButton from "../MainButton"
import { PlusIcon, XIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { PublicKey } from "@solana/web3.js"
import { REQUIRED } from "../../pages/create"

const CreatorsInput = ({ creators, setCreators, setError }) => {
  
  const handleChange = (callback) => {
    setCreators(prev => {
      const newCreators = typeof callback === "function" ? callback(prev) : callback //mimic setState functionality
      //check new state before returning it
      const total = newCreators.reduce((acc, curr) => acc + Number(curr.share), 0)
      let allValidAddress = true
      let allAddressesEntered = true
      const mappedCreators = newCreators.map(creator => { 
        //set a soft error if the address is empty
        const isEmpty = !creator.address
        if (isEmpty) {
          allAddressesEntered = false
          return creator
        }
        try {
          //Set the address to a PublicKey object and confirm it is valid
          const address = new PublicKey(creator.address);
          const isValid = PublicKey.isOnCurve(address);
          if (!isValid) {
            allValidAddress = false
            return creator
          }

          //valid address, return the creator with the address as a PublicKey object
          return {
            ...creator,
            share: Number(creator.share),
            address
          }
        } catch (error) {
          allValidAddress = false
          return creator
        }
      })
      if (!allAddressesEntered) setError(prev => ({ ...prev, creator: REQUIRED })) 
      else if(!allValidAddress) setError(prev => ({ ...prev, creator: `Creators need a valid Solana Address` }))
      else if (total !== 100) setError(prev => ({ ...prev, creator: `Creator percentages must add up to 100%.` }))  
      else setError(prev => ({ ...prev, creator: null }))

      return mappedCreators 
    })
  }

  const addCreator = () => { 
    handleChange(prev => [...prev, {
      address: "",
      share: 0,
    }])
  }


  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Creators</p>
      <div className=" border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 min-h-[100px]">
        {creators.map((creator, i) => (<CreatorItem key={"creator"+i} index={i} handleChange={handleChange} creator={creator} />))}
        <button
          onClick={addCreator}
          className={clsx(
            "w-full h-10 p-0 flex items-center justify-center gap-2 hover:scale-105 active:scale-100 duration-300",
            )}
            >
          Add Creator<PlusIcon className="inline-block w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default CreatorsInput

const CreatorItem = ({ creator, index, handleChange }) => {

  const isPrimaryCreator = index === 0

  const removeCreator = () => {
    if (isPrimaryCreator) return // can't remove the primary creator
    handleChange(prev => prev.filter((_, i) => i !== index))
  }

  const editAddress = (e) => {
    handleChange(prev => { 
      const newCreators = [...prev]
      newCreators[index].address = e.target.value
      return newCreators
    })
  }

  const editShare = (e) => {
    handleChange(prev => { 
      const newCreators = [...prev]
      newCreators[index].share = e.target.value
      return newCreators
    })
  }

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex justify-between items-center gap-2 w-full border-b-2 bg-neutral-100 dark:bg-neutral-900">
        <input
          className={clsx("bg-transparent outline-none  dark:border-neutral-700 w-full pl-1",
            isPrimaryCreator && "font-bold"
          )}
          disabled={isPrimaryCreator}
          type="text"
          value={creator.address}
          onChange={editAddress}
          placeholder="Creator Address"
        />

        <div className="flex justify-end">
          <input
            type="number"
            min={0}
            max={100}
            className="outline-none bg-transparent font-bold w-12 text-right"
            placeholder="Creator Split"
            onChange={editShare}
            value={creator.share}
          />
          <p>%</p>
        </div>
      </div>
      <button onClick={removeCreator} className={clsx("duration-200 hover:scale-105 active:scale-100 opacity-50 hover:opacity-100", isPrimaryCreator && "hidden")}>
        <XIcon className="w-5 h-5" />
      </button>

    </div>
  )
}