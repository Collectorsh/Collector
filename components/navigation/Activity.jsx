import Link from "next/link";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import { ChevronDownIcon } from "@heroicons/react/outline";

export default function Activity() {
  const [user] = useContext(UserContext);

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0 z-20">
      {/* Profile dropdown */}
      <Menu as="div" className="mr-8 relative">
        <div>
          <Menu.Button className="flex text-sm rounded-full focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <p className="menu text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
              Collect
              <ChevronDownIcon
                className="h-4 w-4 ml-1 inline"
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
              <Link href="/activity?id=buynow">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Buy Now
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/activity?id=following">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Auctions
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/activity?id=bids">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Bids
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/activity?id=follow">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Follow Artists
                </a>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
