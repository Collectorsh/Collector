import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import UserContext from "/contexts/user";
import NotFound from "../404";

export default function MainNavigation() {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  const router = useRouter();
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);
  const { publicKey } = useWallet();

  function signOut() {
    wallet.disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
    });
  }

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0 z-20">
      {/* Profile dropdown */}
      <Menu as="div" className="mr-8 relative">
        <div>
          <Menu.Button className="flex text-sm rounded-full focus:outline-none">
            <span className="sr-only">Open user menu</span>
            {/* {user && user.twitter_profile_image ? (
              <img
                src={user.twitter_profile_image}
                alt="default img"
                className="h-8 w-8 rounded-full"
              />
            ) : ( */}
              User menu
            {/* )} */}
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
              {publicKey ? (
                <p className="bg-neutral-500/10 rounded-xl mx-2 my-1 block px-4 py-2 text-sm text-neutral-700">
                  {publicKey.toBase58().substr(0, 4)}...
                  {publicKey.toBase58().slice(-4)}
                </p>
              ) : (
                <p>Connect</p>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              <Link href={`/${user.username}/profile`}>
                <a className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                  Profile
                </a>
              </Link>
            </Menu.Item> */}
            <Menu.Item>
              <Link href="/settings">
                <a className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                  Settings
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="#">
                <a
                  onClick={signOut}
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </a>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
