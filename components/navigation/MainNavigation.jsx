import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useContext, useEffect, Fragment, Suspense, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "/contexts/user";
import { Dialog, Transition } from "@headlessui/react";
import DarkMode from "/components/navigation/DarkMode";
import ConnectWallet from "/components/wallet/ConnectWallet";
import Gallery from "/components/navigation/Gallery";
import CreateUsernameModal from "/components/onboarding/CreateUsernameModal";
import WalletButton from "./WalletButton";
import RpcHealthFeedback from "./RpcHeathFeedback";

import * as Icon from 'react-feather'
import { UserCard } from "./Gallery";

export default function MainNavigation() {
  const wallet = useWallet();
  const router = useRouter();
  const path = router.asPath;
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const isCuratorApproved = user?.curator_approved || (user?.subscription_level === "pro");
  
  function toggleMenu() {
    setOpen(!open);
  }

  useEffect(() => {
    //if no wallet connected but stale user, sign out
    if (user && !wallet.publicKey) signOut();

  //only check for stale user on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="pb-[76px] relative">
      <ConnectWallet />
      <CreateUsernameModal />
      <nav className="palette1 shadow-black/10 shadow py-4 md:py-2 w-full z-20 top-0 h-[76px] fixed px-4 sm:px-8">
        <RpcHealthFeedback />
        <div className="max-w-screen-2xl 2xl:px-8 mx-auto">
          <div>
            <div className="flex">
              <div className="flex items-center col-span-1">
                <div className="cursor-pointer md:my-3 flex gap-4 items-end ">
                  <Link href="/">
                    <a className="collector text-3xl font-bold flex items-center">
                      collect<span className="w-[1.05rem] h-[1rem] rounded-[0.5rem] bg-black dark:bg-white inline-block -mb-[0.35rem] mx-[0.06rem]"></span>r
                    </a>
                  </Link>
                  <span className="collector tracking-wide pb-[1px]">Beta</span>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-end w-full">
                <Link href="/about">
                  <a className="mr-8 font-bold">
                    About
                  </a>
                </Link>
            
                {user
                  ? <Gallery />//<Profile />
                  : (
                    <div className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
                      <WalletButton /> 
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
                  <Icon.Menu />
                </button>
              </div>
            </div>
          </div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 overflow-hidden z-[1001]"
              onClose={() => setOpen(true)}
            >
              <div className="absolute inset-0 overflow-hidden">
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
                    <div className="pointer-events-auto relative w-screen palette1 p-6">
                       
                      <div className="flex z-30 justify-between w-full pb-5">
                        <button
                          type="button"
                          className="rounded-md outline-none focus:outline-none cursor-pointer"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <Icon.X aria-hidden />
                        </button>
                        <DarkMode />
                      </div>

                      <div className="flex flex-col gap-2 p-4 text-xl">
                      
                        <Link href="/" passHref>
                          <p className="">Home</p>
                        </Link>
                        <hr className="borderPalette3"/>
                        <Link href="/about" passHref>
                          <p className="">About</p>
                        </Link>
                        <hr className="borderPalette3" />
                        {user
                          ? (<>
                            {user.subscription_level === "pro"
                              ? (<>
                                <Link href={`/gallery/${ user.username }`} passHref>
                                  <p className="">My Gallery</p>
                                </Link>
                                <hr className="borderPalette3" />
                              </>)
                              : null
                            }
                              
                            {isCuratorApproved
                              ? (<>
                                <Link href={`/create`} passHref>
                                  <p className="">Mint</p>
                                </Link>
                                <hr className="borderPalette3" />
                                <Link href={`/submissions`} passHref>
                                  <p className="">Submissions</p>
                                </Link>
                                <hr className="borderPalette3" />
                              </>)
                              : null
                            }
                            
                          </>)
                          : <WalletButton />
                        }
                      </div>
                      
                      {user
                        ? <UserCard inset />
                        : null
                      }
                      
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
