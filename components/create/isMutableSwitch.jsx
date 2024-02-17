import { Switch } from "@headlessui/react";
import clsx from "clsx";
import * as Icon from 'react-feather'
import Checkbox from "../checkbox";

const IsMutableSwitch = ({ isMutable, setIsMutable }) => { 

  const text = isMutable
    ? <p className="text-sm textPalette2">You can make edits to metadata in the future.</p>
    : <p className="text-sm textPalette2"><span className="text-red-600 font-bold">This is Permanent. </span>All future metadata edits are prevented.</p>

  return (      
    <div className="flex gap-3 items-center flex-wrap ml-4">
      <Checkbox
        label="Mutable"
        checked={isMutable}
        onChange={() => {setIsMutable(prev => !prev)}}
        className="font-bold text-lg"
        labelLeft
      />
      {text}
    </div>
  )
}

export default IsMutableSwitch;