import { CheckIcon } from "@heroicons/react/solid";

const { default: clsx } = require("clsx");

const Checkbox = ({ label, checked, onChange, className, labelLeft = false }) => (
  <label className={clsx(
    "flex items-center gap-2 cursor-pointer",
    className
  )}>
    {labelLeft && label}
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className={clsx(
      "w-5 h-5 rounded border-[3px] palette2 borderPalette3",
    )}>
      {checked && (
        <CheckIcon className="w-full h-full stroke-2" />
      )}
    </span>
    {!labelLeft && label}
  </label>
)

export default Checkbox;