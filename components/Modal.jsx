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
  closeButtonPlacement = "absolute top-2 right-2",
  padding
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="z-[1001] relative w-screen h-modal">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur w-full h-full" />
        </Transition.Child>

        <div className="p-2 fixed inset-0 w-screen h-modal flex justify-center items-center">
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
                padding || "p-2 sm:px-14 sm:py-6",
                "relative  rounded-lg palette3",
                "shadow-md shadow-black/25",
                "w-full max-h-[calc(100%-1rem)]",
                "flex flex-col",
                widthClass
              )}
            >
          
              <button onClick={onClose} className={clsx("palette3 hoverPalette3 rounded-full p-1 z-10", closeButtonPlacement, closeDisabled && "hidden")}>
                <Icon.X size={24} strokeWidth={2.5} />
              </button>
              {title ? < Dialog.Title className="text-center font-bold text-3xl px-7 pt-2 pb-4">{title}</Dialog.Title> : null}
            
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}