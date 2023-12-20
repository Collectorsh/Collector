import Tippy from "@tippyjs/react"
import { REQUIRED } from "../../pages/create"
import { InformationCircleIcon } from "@heroicons/react/solid"

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
      content="The percentage of all secondary sales the creator(s) will get."
      className="shadow-lg"
    >
      <InformationCircleIcon className="w-4" />
    </Tippy>
  )

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4 flex items-center">Royalties* {info}</p>
      <div className="flex w-full border-4 p-3 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
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