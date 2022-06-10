import { Fragment, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { host } from "/config/settings";
import UserContext from "/contexts/user";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { exportAsPicture } from "/utils/collection/exportAsPicture";
import { downloadMintList } from "/utils/collection/downloadMintList";
import LoadingModal from "/components/LoadingModal";
import {
  EyeIcon,
  EyeOffIcon,
  ViewListIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

export default function Actions({
  toggleVisibility,
  handleSaveLayout,
  tokens,
}) {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const saveCollage = useCallback(async (e) => {
    setLoading(true);
    await exportAsPicture(e);
    setLoading(false);
  }, []);

  return (
    <>
      <div className="float-right align-middle">
        {user && user.username && (
          <button className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer mr-4 inline-flex justify-center rounded-lg focus:outline-none hover:bg-gray-800 hover:dark:bg-gray-200 font-bold">
            <Link href={`${host}/${user.username}`}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${host}/${user.username}`}
              >
                <span className="">View Gallery</span>
              </a>
            </Link>
            <div className="-mr-2 ml-1 mt-0.5 h-6 w-1"></div>
          </button>
        )}

        <Menu
          as="div"
          className="hidden md:inline-flex relative text-left sm:z-10"
        >
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-lg py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer focus:outline-none hover:bg-gray-800 hover:dark:bg-gray-200 font-bold">
              Actions
              <ChevronDownIcon
                className="-mr-2 ml-1 mt-0.5 h-6 w-6"
                aria-hidden="true"
              />
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
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-whitish ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  <span
                    className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={(e) => toggleVisibility(false)}
                  >
                    <EyeOffIcon className="h-4 w-4 text-gray-800 align-middle inline mr-1" />
                    <span className="align-middle">Hide All</span>
                  </span>
                </Menu.Item>
                <Menu.Item>
                  <span
                    className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={(e) => toggleVisibility(true)}
                  >
                    <EyeIcon className="h-4 w-4 text-gray-800 align-middle inline mr-1" />
                    <span className="align-middle">Show All</span>
                  </span>
                </Menu.Item>
                <Menu.Item>
                  <span
                    className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={(e) => downloadMintList(e, tokens)}
                  >
                    <ViewListIcon className="h-4 w-4 text-gray-800 align-middle inline mr-1" />
                    <span className="align-middle">Download Mint List</span>
                  </span>
                </Menu.Item>
                <Menu.Item>
                  <span
                    className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={(e) => saveCollage(e)}
                  >
                    <PhotographIcon className="h-4 w-4 text-gray-800 align-middle inline mr-1" />
                    <span className="align-middle">Download Collage</span>
                  </span>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer align-top ml-4 align-middle hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
          onClick={(e) => handleSaveLayout(e)}
        >
          Save Layout
        </button>
      </div>
      <LoadingModal
        open={loading}
        title="Downloading Collage"
        content="We're busy building your collage, please be patient"
      />
    </>
  );
}
