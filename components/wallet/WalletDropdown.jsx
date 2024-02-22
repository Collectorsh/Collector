import { Menu, Transition } from "@headlessui/react";
import * as Icon from 'react-feather'
import clsx from "clsx";
import { Fragment, useContext } from "react";
import UserContext from "../../contexts/user";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncate } from "../../utils/truncate";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const WalletDropdown = () => { 
  const [user] = useContext(UserContext);
  const wallet = useWallet()
  const { setVisible: setModalVisible } = useWalletModal();

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className={clsx(
            "flex rounded-md px-3 py-1 border-0 ring-0 outline-none duration-300",
            "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-800 hover:dark:bg-zinc-700"
          )}>
            <span className="sr-only">Open wallet menu</span>
            <p className="text-base cursor-pointer font-bold inline-flex items-center justify-center gap-2 ">
              {wallet?.publicKey ? truncate(wallet?.publicKey?.toBase58(), 4) : "Connect Wallet"}
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
            <Menu.Items className="palette2 absolute top-full right-1/2 translate-x-[50%] mt-2 py-2 px-4 w-fit overflow-hidden rounded-md shadow-md outline-none text-left">
              {user?.public_keys.map((address) => {
                const handleWalletChange = async () => { 
                  setModalVisible(true)
                }
                return (
                  <Menu.Item key={address}>
                    <button onClick={handleWalletChange} className="p-2 hoverPalette2">{address}</button>
                  </Menu.Item>
                )
              })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default WalletDropdown;