import Link from "next/link";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useWallet } from "@solana/wallet-adapter-react";

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
        <div>
          <Menu.Button className="flex text-sm rounded px-3 focus:outline-none  border-black dark:border-white">
            <span className="sr-only">Open user menu</span>
            <p className="text-base cursor-pointer inline font-bold text-gray-900 dark:text-gray-100">
              Menu
              <ChevronDownIcon
                className="h-4 w-4 inline ml-1 mb-0.5"
                aria-hidden="true"
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
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-left">
            <Menu.Item>
              <p className="bg-gray-500/10 rounded-xl mx-2 my-1 px-3 py-2 text-sm text-gray-700">
                {publicKey?.toBase58().substr(0, 4)}...
                {publicKey?.toBase58().slice(-4)}
              </p>
            </Menu.Item>
            {user.subscription_level === "pro" ? (
              <Menu.Item>
                <Link href={`/gallery/${ user.username }`}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Gallery
                  </a>
                </Link>
              </Menu.Item>
            ) : (
                <a className="block px-4 py-2 text-sm text-gray-700 ">
                  My Gallery <span className="text-xs">(coming soon!)</span>
                </a>
            )}
            {isCuratorApproved ? (
              <>
                <Menu.Item>
                  <Link href={`/submissions`}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Submissions
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href={`/create`}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Create
                    </a>
                  </Link>
                </Menu.Item>
              </>
            ) : null}
          
            <Menu.Item>
              <Link href="/settings">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button className="block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={signOut}
              >
                Sign out
              </button>
            </Menu.Item>
            

         
            
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
