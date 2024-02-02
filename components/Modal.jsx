import { Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/outline";
import clsx from "clsx";

export default function Modal({
  title,
  isOpen,
  onClose,
  closeDisabled,
  children,
  widthClass = "max-w-screen-xl",
  closeButtonPlacement = "absolute top-2 right-2 md:"
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="z-[1001] relative w-screen h-screen dark:text-white">
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
                "relative p-2 md:px-14 md:py-6 rounded-lg bg-white",
                "dark:bg-neutral-800",
                "shadow-md shadow-black/25 dark:shadow-neutral-500/25",
                "w-full max-h-[calc(100%-1rem)]",
                "flex flex-col",
                widthClass
              )}
            >
          
              <button onClick={onClose} className={clsx("duration-200 hover:scale-105 active:scale-100", closeButtonPlacement, closeDisabled && "hidden")}>
                <XCircleIcon className="w-8 h-8" />
              </button>
              {title ? < Dialog.Title className="text-center font-bold text-3xl py-4">{title}</Dialog.Title> : null}
            
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}