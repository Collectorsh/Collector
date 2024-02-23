import clsx from 'clsx';
import * as Icon from 'react-feather'

const Checkbox = ({ label, checked, onChange, className, labelLeft = false }) => (
  <label className={clsx(
    "flex items-center justify-center gap-2 cursor-pointer",
    className
  )}>
    {labelLeft && label}
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className={clsx(
      "w-6 h-6 rounded border-2 palette2 borderPalette3",
    )}>
      {checked && (
        <Icon.Check size={19} strokeWidth={2.5} className="mt-[1px] ml-[1px]" />
      )}
    </span>
    {!labelLeft && label}
  </label>
)

export default Checkbox;