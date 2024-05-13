
import { useContext, useState } from "react"
import { RPC_HEALTH, RpcHealthContext } from "../../contexts/RpcHealth"
import { Transition } from "@headlessui/react"
import { RoundedCurve } from "../curations/roundedCurveSVG"
import * as Icon from 'react-feather'
import Link from "next/link";

const RpcHealthFeedback = () => {
  const rpcStatus = useContext(RpcHealthContext)
  const badHealth = rpcStatus === RPC_HEALTH.ERROR 
  const [show, setShow] = useState(true)
  // const show = badHealth
  return (
    <Transition
      // show={badHealth}
      show={show}
      className="absolute bottom-0 left-0 translate-y-[100%] w-full flex justify-center"
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100 "
      leave="ease-in-out duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="relative bg-amber-400 p-1.5 px-2 sm:px-0 w-full sm:w-fit grid grid-cols-[1fr_auto]">
        <p className="text-center text-sm text-neutral-800">
          
          {/* Solana is experiencing network congestion. Please retry failed transactions. */}
          Collector is <Link href="https://x.com/N8Solomon/status/1788965948545806557" target="_blank" className="underline">shutting down</Link> soon. Thank you for all of your support over the years. Please delist master editions. No further action is required.
        </p>
        <button
          onClick={() => setShow(false)}
          className="opacity-75 hover:opacity-100 duration-300"
        >
          <Icon.X size={20} strokeWidth={2.5} color="gray"/>
        </button>
        <RoundedCurve className="absolute top-0 -left-8 w-8 h-full fill-amber-400  transform scale-x-[-1] scale-y-[-1]" />
        <RoundedCurve className="absolute top-0 -right-8 w-8 h-full fill-amber-400 transform scale-y-[-1]" />
      </div>
    </Transition>
  )

}

export default RpcHealthFeedback