import Link from "next/link";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import { useWallet } from "@solana/wallet-adapter-react";
import * as Icon from 'react-feather'
import clsx from "clsx";
import Tippy from "@tippyjs/react";


export default function Gallery() {
  const [user, setUser] = useContext(UserContext);
  const { publicKey, disconnect } = useWallet();
  
  function signOut() {
    disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
    });
  }

  const isCuratorApproved = user?.curator_approved || (user?.subscription_level === "pro");

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0 z-20">
      {/* Profile dropdown */}
      <Menu as="div" className="mr-8 relative">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="flex text-sm rounded px-3 focus:outline-none  border-black dark:border-white">
                <span className="sr-only">Open user menu</span>
                <p className="text-base cursor-pointer font-bold text-gray-900 dark:text-gray-100 inline-flex items-end gap-1 ">
                  Menu
                  <Icon.ChevronDown
                    size={22}
                    strokeWidth={2.4}
                    className={clsx("duration-300", open ? "transform rotate-180" : "")}
                  />
                </p>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 overflow-hidden rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-left">
                <div className="m-2 bg-neutral-200 shadow-inner rounded-md flex items-between overflow-hidden w-full">
                  <div className=" text-gray-700 px-2 py-1 flex flex-col items-start justify-center">
                      <p className="truncate">{user?.username}extraaaaaaaa</p>
                      <p className="text-xs opacity-50">
                        {publicKey?.toBase58().substr(0, 4)}...
                        {publicKey?.toBase58().slice(-4)}
                      </p>

                  </div>
                  <div className="flex">
                    <Tippy content="Profile settings">
                      <Link href="/settings">
                        <a className=" text-gray-700 hover:bg-gray-100  px-2 py-1 duration-300 rounded-md flex items-center">
                          <Icon.Settings size={20} />
                        </a>
                      </Link>
                    </Tippy>

                    <Tippy content="Log out">
                      <button className="block text-left text-gray-700 hover:bg-gray-100 px-2 py-1 duration-300 rounded-md"
                        onClick={signOut}
                      >
                        {/* Sign out */}
                        <Icon.LogOut size={20} />
                      </button>
                    </Tippy>
                  </div>

             

                </div>
              

                {user.subscription_level === "pro" ? (
                  <Menu.Item>
                    <Link href={`/gallery/${ user.username }`}>
                      <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Gallery
                      </a>
                    </Link>
                  </Menu.Item>
                ) : null}
                {isCuratorApproved ? (
                  <>
                    <Menu.Item>
                      <Link href={`/create`}>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Mint
                        </a>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href={`/submissions`}>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Submissions
                        </a>
                      </Link>
                    </Menu.Item>
                  </>
                ) : null}

                {/* <hr /> */}

                
                

            
                
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
