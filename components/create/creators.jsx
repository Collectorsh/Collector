import clsx from "clsx"
import { PublicKey } from "@solana/web3.js"
import { REQUIRED } from "../../pages/create"
import Tippy from "@tippyjs/react"
import * as Icon from 'react-feather'

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
      verified: false,
      share: 0,
    }])
  }

  const info = (
    <Tippy
      content="The wallet address and share of royalties for each creator"
    >
      <Icon.Info size={14} className="opacity-50"/>
    </Tippy>
  )


  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 flex gap-1">Creators {info}</p>
      <div className="w-full px-3.5 py-2 outline-none rounded-md border-2 bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 min-h-[100px]">
        {creators.map((creator, i) => (<CreatorItem key={"creator"+i} index={i} handleChange={handleChange} creator={creator} />))}
        <button
          onClick={addCreator}
          className={clsx(
            "w-full h-10 flex items-center justify-center gap-1.5 hoverPalette2 rounded-md px-2",
            )}
            >
          Add Creator
          <Icon.Plus size={18} strokeWidth={2.5}/>
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
      <div className="flex justify-between items-center gap-0.5 w-full border-b-2 borderPalette2">
        <input
          className={clsx("bg-transparent outline-none w-full pl-1",
            isPrimaryCreator && "font-bold"
          )}
          disabled={isPrimaryCreator}
          type="text"
          value={creator.address}
          onChange={editAddress}
          placeholder="Creator Address"
        />

        <p>-</p>

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
      <button onClick={removeCreator} className={clsx("duration-300 opacity-50 hover:opacity-100", isPrimaryCreator && "hidden")}>
        <Icon.X size={20} />
      </button>

    </div>
  )
}