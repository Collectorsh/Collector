import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useContext, Fragment } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "/contexts/user";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import DarkMode from "/components/navigation/DarkMode";
import ConnectWallet from "/components/wallet/ConnectWallet";
import Profile from "/components/navigation/Profile";

export default function MainNavigation(props) {
  const wallet = useWallet();
  const router = useRouter();
  const path = router.asPath;
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false);

  function toggleMenu() {
    console.log(!open);
    setOpen(!open);
  }

  function signOut() {
    wallet.disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
      router.push("/");
    });
  }

  return (
    <div className="mx-auto">
      <nav className="px-4 xl:px-0 mx-auto py-4 md:py-2 bg-white dark:bg-black fixed w-full z-20 top-0 h-[74px] relative">
        <div>
          <div className="flex">
            <div className="flex items-center col-span-1 w-[200px] lg:w-1/2">
              <div className="cursor-pointer md:my-3 w-[200px]">
                {/* <!-- Website Logo --> */}
                <Link href="/">
                  <h1 className="text-2xl text-black dark:text-white font-bold">
                    <span className="align-middle">Collector</span>
                  </h1>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex text-right items-center col-span-1 justify-end w-full">
              {user && (
                <>
                  <p className="menu mr-6 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                    <Link href="/">Home</Link>
                  </p>
                  <p className="menu mr-6 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                    <Link href="/dashboard">Gallery</Link>
                  </p>
                  <p className="menu mr-6 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                    <Link href="/dashboard/bids">Bids</Link>
                  </p>
                  <p className="menu mr-6 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                    <Link href="/dashboard/artists">Artists</Link>
                  </p>
                  <p className="menu mr-6 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                    <Link href="/dashboard/following">Following</Link>
                  </p>
                </>
              )}
              {user ? <Profile /> : <ConnectWallet />}
              <DarkMode />
            </div>
            {/* <!-- Mobile menu button --> */}
            <div className="flex md:hidden text-right items-center col-span-1 justify-end w-full">
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
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 overflow-hidden z-20"
            onClose={() => setOpen(true)}
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
                <Dialog.Overlay className="absolute inset-0 transition-opacity" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 left-0 flex pt-4 pr-2 sm:-ml-10 sm:pr-4 z-30">
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
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <div className="pointer-events-auto relative w-screen">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-black pb-6 shadow-xl">
                      <div className="relative mt-12 flex-1 px-4 sm:px-6">
                        <div className="absolute inset-0 px-4 sm:px-6 mt-2">
                          <div className="mt-4 dark:text-gray-200">
                            <div className="mr-4 inline">
                              <DarkMode />
                            </div>
                            <span className="-ml-2">Toggle Dark Mode</span>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            <p
                              className={`text-xl cursor-pointer border-b-2 py-2 border-gray-100 dark:border-dark3 ${
                                path === "/" ? "font-bold" : ""
                              }`}
                            >
                              <Link href="/">Home</Link>
                            </p>
                            {user && (
                              <>
                                <div className="mt-0">
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard">Gallery</Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/bids">Bids</Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/artists">
                                      Artists
                                    </Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/following">
                                      Following
                                    </Link>
                                  </p>
                                </div>
                                <div className="mt-6">
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/profile">
                                      Profile
                                    </Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/settings">
                                      Settings
                                    </Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/notifications">
                                      Notifications
                                    </Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/dashboard/wallets">
                                      Wallets
                                    </Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <a onClick={signOut}>Sign Out</a>
                                  </p>
                                </div>
                              </>
                            )}
                            {!user && (
                              <div className="mt-8 md:mt-0">
                                <ConnectWallet />
                              </div>
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
