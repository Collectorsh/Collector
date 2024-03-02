import { Menu, Transition } from "@headlessui/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import * as Icon from 'react-feather'

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletButton = () => {

  return (
    <div>
      < WalletMultiButton  />
      {/* <div className="hidden md:block">
      </div>
      <MobileAppMenu /> */}
    </div>
  )
}

export default WalletButton

const MobileAppMenu = () => {
  const { setVisible } = useWalletModal();

  const phantomLink = typeof window !== "undefined"
    ? `https://phantom.app/ul/browse/?ref=${ window.location.href }&url=${ window.location.href }`
    : "https://phantom.app/ul/browse/";
  
  const solflareLink = typeof window !== "undefined"
    ? `https://solflare.com/ul/browse/?ref=${ window.location.href }&url=${ window.location.href }`
    : "https://solflare.com/ul/browse/";
  

  return (
    <Menu as="div" className="mr-4 relative md:hidden">
      {({ open }) => (
        <>
          <Menu.Button className="flex rounded-md px-3 py-1 border-0 ring-0 outline-none hoverPalette1 ">
            <span className="sr-only">Open Mobile Wallet Apps menu</span>
            <p className="cursor-pointer inline-flex items-center justify-center gap-1 ">
              Sign In
              <Icon.ChevronDown
                size={24}
            
                className={clsx("duration-300", open ? "transform rotate-180" : "")}
              />
            </p>
          </Menu.Button>

          <Transition
            className="relative"
           
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="palette2 origin-top-left absolute -left-0 mt-2 pt-2 w-fit overflow-hidden rounded-md shadow-md outline-none text-left">
              <div className="p-2 pt-0">    
                <Menu.Item>
                  <Link href={phantomLink}>
                    <a className="block p-2 hoverPalette2 rounded-md">
                      Open in Phantom App
                    </a>
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link href={solflareLink}>
                    <a className="block p-2 hoverPalette2 rounded-md">
                      Open in Solflare App
                    </a>
                  </Link>
                </Menu.Item>

                <hr className="my-2 borderPalette3" />

                <Menu.Item>
                  <button
                    className="text-left block p-2 hoverPalette2 rounded-md"
                    onClick={() => setVisible(true)}
                  >
                    Select Wallet
                  </button>
                </Menu.Item>
               </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}