import { Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import * as Icon from "react-feather";

export default function Modal({
  title,
  isOpen,
  onClose,
  closeDisabled,
  children,
  widthClass = "max-w-screen-xl",
  closeButtonPlacement = "absolute top-2 right-2"
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="z-[1001] relative w-screen h-screen">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur" />
        </Transition.Child>

        <div className="p-2 fixed inset-0 w-screen h-screen flex justify-center items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-10"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-10"
          >
            <Dialog.Panel
              className={clsx(
                "relative p-2 md:px-14 md:py-6 rounded-lg palette3",
                "shadow-md shadow-black/25",
                "w-full max-h-[calc(100%-1rem)]",
                "flex flex-col",
                widthClass
              )}
            >
          
              <button onClick={onClose} className={clsx("hoverPalette3 rounded-full p-1", closeButtonPlacement, closeDisabled && "hidden")}>
                <Icon.X size={24} strokeWidth={2.5} />
              </button>
              {title ? < Dialog.Title className="text-center font-bold text-3xl pt-2 pb-4">{title}</Dialog.Title> : null}
            
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}