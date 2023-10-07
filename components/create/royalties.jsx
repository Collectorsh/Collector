import { REQUIRED } from "../../pages/create"

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
  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Royalties*</p>
      <div className="flex w-full border-4 px-3 py-2 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
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