import Tippy from "@tippyjs/react"
import { REQUIRED } from "../../pages/create"
import * as Icon from 'react-feather'
const RoyaltiesInput = ({ royalties, setRoyalties, setError }) => { 
  const max = 90
  const handleChange = (e) => { 
    const value = e.target.value
    setRoyalties(value)
    const isLess = value < 0
    const isMore = value > max
    const isUndefined = value !== 0 && !value
    if (isUndefined) setError(prev => ({ ...prev, royalties: REQUIRED }))
    else if (isLess || isMore) setError(prev => ({
      ...prev,
      royalties: isMore ? `Royalties can be no more than ${ max }%.` : "Royalty must be a valid number."
    }))
    else setError(prev => ({ ...prev, royalties: null }))
  }

  const info = (
    <Tippy
      content="The percentage of all secondary sales the creator(s) will get"
    >
      <Icon.Info size={14} className="opacity-50"/>
    </Tippy>
  )

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 flex gap-1">Royalties {info}</p>
      <div className="flex w-full px-3.5 py-2 outline-none rounded-md border-2 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
        <input
          type="number"
          min={0}
          max={90}
          className="outline-none bg-transparent w-full"
          placeholder="Royalty Percentage"
          onChange={handleChange}
          value={royalties}
        />
        <p>%</p>
      </div>
    </div>
  )
}

export default RoyaltiesInput