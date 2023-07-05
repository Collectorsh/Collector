import { Dialog } from "@headlessui/react";

export default function OptimizeFeedbackModal({isOpen, setIsOpen, completed, waiting, progress}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/70 " aria-hidden="true" style={ {backdropFilter: "blur(8px)"}} />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="p-4 md:p-8 mx-auto w-full max-w-screen-lg rounded-lg bg-white dark:bg-dark2 text-black dark:text-neutral-200">
          <Dialog.Title className="text-3xl font-bold text-center mb-4">Optimization in Progress</Dialog.Title>
          <p className="font-bold">We are currently optimizing your artwork in order to provide a premium viewing and editing experience.</p>
          <br />
          <p className="mb-6">This only needs to be done once and it usually takes less than a second per artwork. However, if there are large file sizes or if your collection is large it could take a several minutes. Thank you for your patience!</p>

          <div className="flex items-center gap-4 relative">
            <p className="flex-shrink-0">Optimizing Images: <span>({completed}/{waiting})</span></p>
            <div className="border-2 border-black dark:border-white rounded-full w-full h-3 relative" >
              <div
                style={{ width: `${ progress }%` }}
                className="bg-black dark:bg-white rounded-full h-2 w-0 absolute inset-0 animate-pulse"
              />
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}