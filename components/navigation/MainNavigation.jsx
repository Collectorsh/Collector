import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useContext, useEffect, Fragment } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "/contexts/user";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, BellIcon } from "@heroicons/react/outline";
import DarkMode from "/components/navigation/DarkMode";
import ConnectWallet from "/components/wallet/ConnectWallet";
import Profile from "/components/navigation/Profile";
import Gallery from "/components/navigation/Gallery";
import CreateUsernameModal from "/components/CreateUsernameModal";
import { truncate } from "../../utils/truncate";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function MainNavigation() {
  const wallet = useWallet();
  const router = useRouter();
  const path = router.asPath;
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const isCuratorApproved = user?.curator_approved

  function toggleMenu() {
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
    <div className="pb-[76px]">
      <ConnectWallet />
      <CreateUsernameModal />
      <nav className="bg-white dark:bg-black shadow py-4 md:py-2 w-full z-20 top-0 h-[76px] fixed px-4 sm:px-8">
        <div className="max-w-screen-2xl mx-auto">


        <div>
          <div className="flex">
            <div className="flex items-center col-span-1">
              <div className="cursor-pointer md:my-3 flex gap-4 items-center ">
                <Link href="/">
                  <a className="collector text-3xl font-bold flex items-center">
                  collect<span className="w-[1.05rem] h-[1rem] rounded-[0.5rem] bg-black dark:bg-white inline-block -mb-[0.35rem] mx-[0.06rem]"></span>r
                    </a>
                  </Link>
                  {/* <span className="mt-2 collector">-</span> */}
                  <span className="mt-2 collector tracking-wide">Beta</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-end w-full">
              {/* <p className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                <Link href="/feed">Feed</Link>
              </p>
              <p className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                <Link href="/drops">Drops</Link>
              </p> */}
              {/* <p className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                <Link href="/shop">Shop</Link>
              </p> */}
                {/* {!user && <Premium />} */}


                {/* 
                <Link href="/discover">
                  <a className="mr-8 font-bold">
                    Discover
                  </a>
                </Link> */}
              <Link href="/about">
                <a className="mr-8 font-bold">
                  About
                </a>
              </Link>
              {user && (
                <>
                  <Gallery />
                  {/* {user.token_holder && <Activity />} */}
                  {/* {!user.token_holder && <Premium />} */}
                </>
              )}
                {user
                  ? <Profile />
                  : (
                    <div className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                      <WalletMultiButton />
                    </div>
                  )
                }
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
                <div className="absolute top-0 left-0 flex pt-4 pr-2 z-30">
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
                              <DarkMode withText/>
                            </div>
                          </div>
                          <div className="mt-6 dark:text-gray-200">
                            <p
                            className={`text-xl cursor-pointer border-b-2 py-2 border-gray-100 dark:border-dark3 ${ path === "/" ? "font-bold" : ""
                              }`}
                          >
                            <Link href="/">Home</Link>
                              </p>
                              {/* <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                <Link href="/discover">Discover</Link>
                              </p> */}
                              <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                <Link href="/about">About</Link>
                              </p>
                            {/* {!user && (
                              <>
                                <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                  <Link href="/feed">Feed</Link>
                                </p>
                                <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                  <Link href="/drops">Drops</Link>
                                </p>
                                <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                  <Link href="/shop">Shop</Link>
                                </p>
                                <div className="mt-4">
                                  <Premium />
                                </div>
                              </>
                            )} */}

                            {user && (
                              <>
                                <div className="">
                                  
                                  {/* <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/feed">Feed</Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/drops">Drops</Link>
                                  </p> */}
                                  {/* <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/shop">Shop</Link>
                                  </p> */}
                                  {/* <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href={`/${user.username}/profile`}>
                                      Profile
                                    </Link>
                                  </p> */}
           
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/settings">Settings</Link>
                                  </p>
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                    <Link href="/edit">Edit Gallery</Link>
                                    </p>
                                    {user.subscription_level === "pro" ? (
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href={`/profile/${ user.username }`}>
                                      
                                          Profile
                                          
                                        </Link>
                                      </p>
                                    ) : null}
                                    {isCuratorApproved ? (
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href={`/submissions`}>
                                      
                                          Submissions
                                          
                                        </Link>
                                      </p>
                                    ) : null}
                                  {/* {user.token_holder && (
                                    <>
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href="/activity?id=buynow">
                                          Buy Now
                                        </Link>
                                      </p>
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href="/activity?id=following">
                                          Auctions
                                        </Link>
                                      </p>
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href="/activity?id=bids">
                                          My Bids
                                        </Link>
                                      </p>
                                      <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                        <Link href="/activity?id=follow">
                                          Follow Artists
                                        </Link>
                                      </p>
                                    </>
                                  )} */}
                                  <p className="text-xl font-light cursor-pointer border-b-2 border-gray-100 dark:border-dark3 py-2">
                                      <a onClick={signOut}>
                                        Sign Out
                                        <span className=" ml-4 text-sm">{truncate(wallet?.publicKey?.toString())}</span>
                                      </a>
                                  </p>
                                </div>
                              </>
                            )}
                            {!user && (
                              <div className="mt-8 md:mt-0">
                                  <div className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                                    <WalletMultiButton />
                                  </div>
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
        </div>
      </nav>
    </div>
  );
}
