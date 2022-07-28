import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import FollowButton from "/components/FollowButton";

export default function FollowersModal({ open, followers, closeModal }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="dark:bg-dark3 p-4 relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {followers &&
                followers.map((follow, index) => (
                  <div key={index}>
                    {follow && (
                      <>
                        <div className="float-left clear-both">
                          {follow.twitter_profile_image ? (
                            <img
                              src={follow.twitter_profile_image}
                              className="w-12 h-12 mr-2 rounded-full float-left mb-4"
                            />
                          ) : (
                            <div className="w-12 h-12 mr-2 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                          )}

                          <div className="mt-2 float-left">
                            {follow.username && (
                              <p className="inline mr-2 dark:text-whitish text-lg">
                                {follow.username}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="float-right mt-2">
                          <FollowButton follow={follow} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
