import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "/contexts/user";
import NotFound from "../404";

export default function SettingsMenu() {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  const router = useRouter();
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);


  return (
    <div className="relative -mt-9">
      <Menu as="div" className="absolute top-0 right-0 inset-y-0 z-20">
        <Menu.Button className="text-sm rounded-full focus:outline-none">
          <span className="sr-only">settings menu</span>
          Settings
          {/* <CogIcon className="h-12 w-12" aria-hidden="true" /> */}
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
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-left">
            <Menu.Item>
              <Link href="/settings">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
