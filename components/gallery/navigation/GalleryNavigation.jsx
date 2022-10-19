import Link from "next/link";
import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  Fragment,
} from "react";
import UserContext from "/contexts/user";
import getUserFromApiKey from "/data/user/getUserFromApiKey";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { host } from "/config/settings";
import DarkMode from "/components/navigation/DarkMode";
import { HomeIcon, ShareIcon, UserCircleIcon } from "@heroicons/react/solid";
import TwitterLogo from "/components/logos/TwitterLogo";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function GalleryNavigation({ user }) {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [open, setOpen] = useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  const asyncGetUser = useCallback(async (apiKey) => {
    let res = await getUserFromApiKey(apiKey);
    setLoggedInUser(res.data.user);
  }, []);

  useEffect(() => {
    const apiKey = localStorage.getItem("api_key");
    if (apiKey && !loggedInUser) {
      asyncGetUser(apiKey);
    }
  }, []);

  return (
    <div className="mx-auto px-4">
      <nav className="mx-auto pt-5 px-0 align-middle dark:bg-black">
        <div className="grid grid-cols-6">
          <div className="flex items-center col-span-3 md:col-span-2">
            {user.twitter_user_id && (
              <img
                src={user.twitter_profile_image}
                alt="default img"
                className="h-8 w-8 rounded-full inline mr-2 float-left"
              />
            )}
            <h2 className="text-2xl text-gray-800 font-bold align-middle dark:text-gray-100 mr-2">
              <Link
                href={`/${user.username}`}
                title="Collector Home"
                className="align-middle inline"
              >
                {user.username[0].toUpperCase() + user.username.substring(1)}
              </Link>
            </h2>
            {user.twitter_user_id && (
              <Link
                href={`https://twitter.com/${user.twitter_screen_name}`}
                title="Twitter"
                className="align-middle inline"
              >
                <a target="_blank" className="cursor-pointer">
                  <Tippy
                    content={`@${user.twitter_screen_name}`}
                    className="bg-gray-300"
                  >
                    <TwitterLogo size="25" />
                  </Tippy>
                </a>
              </Link>
            )}
          </div>
          <div className="hidden md:flex text-right items-center col-span-3 md:col-span-4 justify-end">
            <Link
              href="/"
              title="Collector Home"
              className="align-middle inline"
            >
              <HomeIcon
                className="h-6 w-6 inline mx-2 cursor-pointer text-slate-900 dark:text-gray-100 hover:scale-110"
                aria-hidden="true"
              />
            </Link>

            <Link
              href={`/${user.username}/profile`}
              title="Profile"
              className="align-middle inline"
            >
              <a>
                <Tippy content="Profile" className="bg-gray-300">
                  <UserCircleIcon
                    className="h-6 w-6 inline mx-2 cursor-pointer text-slate-900 dark:text-gray-100 hover:scale-110"
                    aria-hidden="true"
                  />
                </Tippy>
              </a>
            </Link>

            <Link
              href={`https://twitter.com/intent/tweet?text=${host}/${user.username}`}
              title="Share to Twitter"
              className="align-middle inline"
            >
              <a target="_blank">
                <Tippy
                  content="Share gallery to Twitter"
                  className="bg-gray-300"
                >
                  <ShareIcon className="w-6 h-6 inline mr-4 text-slate-900 dark:text-gray-100 cursor-pointer hover:scale-110 focus:outline-none" />
                </Tippy>
              </a>
            </Link>

            <div className="mr-1">
              <DarkMode />
            </div>
          </div>
          {/* <!-- Mobile menu button --> */}
          <div className="flex md:hidden text-right items-center col-span-3 md:col-span-4 justify-end">
            <button
              className="outline-none mobile-menu-button cursor-pointer"
              onClick={toggleMenu}
              style={{ background: "none" }}
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-gray-600"
                x-show="!showMenu"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ background: "none" }}
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 overflow-hidden"
            onClose={setOpen}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <div className="pointer-events-auto relative w-screen">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-0 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-800 hover:text-black outline-none focus:outline-none cursor-pointer ml-4 dark:text-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-dark1 pb-6 shadow-xl">
                      <div className="relative mt-12 flex-1 px-4 sm:px-6">
                        <div className="absolute inset-0 px-4 sm:px-6 mt-2">
                          <div className="mt-4 dark:text-gray-200">
                            <DarkMode />
                            <span className="ml-2">Toggle Dark Mode</span>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            <Link
                              href="/"
                              title="Collector Home"
                              className="align-middle inline"
                            >
                              <a>
                                <HomeIcon
                                  className="h-6 w-6 inline mr-4 cursor-pointer text-slate-900 dark:text-gray-100 hover:scale-110"
                                  aria-hidden="true"
                                />
                                <span className="-ml-2">Home</span>
                              </a>
                            </Link>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            <Link
                              href={`/${user.username}/profile`}
                              title="Profile"
                              className="align-middle inline"
                            >
                              <a>
                                <UserCircleIcon
                                  className="h-6 w-6 inline mr-4 cursor-pointer text-slate-900 dark:text-gray-100 hover:scale-110"
                                  aria-hidden="true"
                                />
                                <span className="-ml-2">Profile</span>
                              </a>
                            </Link>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            <Link
                              href={`https://twitter.com/intent/tweet?text=${host}/${user.username}`}
                              title="Share to Twitter"
                              className="align-middle inline"
                            >
                              <a target="_blank">
                                <ShareIcon className="w-6 h-6 inline mr-4 text-slate-900 dark:text-gray-100 cursor-pointer hover:scale-110 focus:outline-none" />
                                <span className="-ml-2">Share to Twitter</span>
                              </a>
                            </Link>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            {loggedInUser &&
                              loggedInUser.username !== user.username && (
                                <>
                                  {loggedInUser.following.find(
                                    (f) => f.id === user.id
                                  ) ? (
                                    <Tippy
                                      content={`Stop following ${user.username}`}
                                      className="bg-gray-300"
                                    >
                                      <button
                                        className="cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4 bg-white text-black border-black hover:border-red-700 dark:hover:border-red-800 dark:bg-black dark:text-whitish dark:border-whitish"
                                        onClick={() =>
                                          followUser(user.id, "unfollow")
                                        }
                                      >
                                        Following
                                      </button>
                                    </Tippy>
                                  ) : (
                                    <Tippy
                                      content={`Follow ${user.username}`}
                                      className="bg-gray-300"
                                    >
                                      <button
                                        className="cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4 bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish"
                                        onClick={() =>
                                          followUser(user.id, "follow")
                                        }
                                      >
                                        Follow
                                      </button>
                                    </Tippy>
                                  )}
                                </>
                              )}
                          </div>
                        </div>
                        {/* /End replace */}
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </nav>
    </div>
  );
}
