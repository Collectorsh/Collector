import Link from "next/link";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import { useWallet } from "@solana/wallet-adapter-react";
import * as Icon from 'react-feather'
import clsx from "clsx";
import Tippy from "@tippyjs/react";
import { displayName } from "../../utils/displayName";


export default function Gallery() {
  const [user, setUser] = useContext(UserContext);
  

  const isCuratorApproved = user?.curator_approved || (user?.subscription_level === "pro");

  return (
    <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0 z-20">
      {/* Profile dropdown */}
      <Menu as="div" className="mr-4 relative">
        {({ open }) => (
          <>
            
            <Menu.Button className="flex rounded-md px-3 py-1 border-0 ring-0 outline-none hoverPalette1">
              <span className="sr-only">Open user menu</span>
              <p className="text-base cursor-pointer font-bold inline-flex items-center justify-center gap-1 ">
                Menu
                <Icon.ChevronDown
                  size={20}
                  strokeWidth={2.6}
                  className={clsx("duration-300", open ? "transform rotate-180" : "")}
                />
              </p>
            </Menu.Button>
           
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="palette2 origin-top-right absolute right-0 mt-2 pt-2 w-56 overflow-hidden rounded-md shadow-md outline-none text-left">
                <div className="px-2">
                  {user.subscription_level === "pro" ? (
                    <Menu.Item>
                      <Link href={`/gallery/${ user.username }`}>
                        <a className="block p-2 hoverPalette2 rounded-md">
                          My Gallery
                        </a>
                      </Link>
                    </Menu.Item>
                  ) : (
                    <a className="block p-2">
                      My Gallery <span className="text-xs">(coming soon!)</span>
                    </a>
                  )}
                  {isCuratorApproved ? (
                    <>
                      <Menu.Item>
                        <Link href={`/create`}>
                          <a className="block p-2 hoverPalette2 rounded-md">
                            Mint
                          </a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href={`/submissions`}>
                          <a className="block p-2 hoverPalette2 rounded-md">
                            Submit
                          </a>
                        </Link>
                      </Menu.Item>
                    </>
                  ) : null}

                </div>

                <hr className="mt-2 borderPalette3"/>

                
               <UserCard />
            
                
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}


export const UserCard = ({inset}) => {
  const [user, setUser] = useContext(UserContext);
  const { publicKey, disconnect } = useWallet();

  function signOut() {
    disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
    });
  }
  return (
    <div className={clsx("palette3 p-2 grid grid-cols-3 overflow-hidden", inset && "rounded-md shadow-inner")}>
    <div className=" px-2 pb-1 flex flex-col items-start col-span-2">
      <p className="truncate w-full">{displayName(user)}</p>
      <p className="text-xs opacity-50">
        {publicKey?.toBase58().slice(0, 4)}...
        {publicKey?.toBase58().slice(-4)}
      </p>
    </div>
    <div className="flex justify-end">
      <Tippy content="Settings" className="shadow">
        <div className="">
          <Link href="/settings">
            <a className="h-full  p-1 rounded-md flex items-center hoverPalette3">
              <Icon.Settings size={inset ? 24 : 20} />
            </a>
          </Link>
        </div>
      </Tippy>

      <Tippy content="Log out" className="shadow">
        <button className="block text-left p-1 rounded-md hoverPalette3"
          onClick={signOut}
        >
          {/* Sign out */}
          <Icon.LogOut size={inset ? 24 : 20} />
        </button>
      </Tippy>
    </div>
    </div>
  )
}