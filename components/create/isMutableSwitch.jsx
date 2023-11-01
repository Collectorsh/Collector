import { Switch } from "@headlessui/react";
import clsx from "clsx";

const IsMutableSwitch = ({ isMutable, setIsMutable }) => { 

  const text = isMutable
    ? <p>You can make edits to the metadata in the future.</p>
    : <p>All future metadata edits are prevented. <span className="text-red-600 font-bold">This is Permanent.</span></p>

  return (
    <div>
      <p className="font-bold text-lg mb-1 ml-4">Mutable</p>
      <div className="flex gap-2 items-center">
        <Switch
          checked={isMutable}
          onChange={setIsMutable}
          className={clsx(
            isMutable ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-red-500 dark:bg-red-600',
            "border-neutral-200 dark:border-neutral-700 border-2",
            "relative inline-flex h-8 w-14 items-center rounded-full flex-shrink-0"
          )}
        >
          <span className="sr-only">Toggle Mutable</span>
          <span
            className={clsx(isMutable ? 'translate-x-7' : 'translate-x-1',
              "inline-block h-5 w-5 transform rounded-full   transition bg-neutral-900 dark:bg-neutral-100"
            )}
          />
        </Switch>
        {text}
      </div>
    </div>
  )
}

export default IsMutableSwitch;