import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Fragment,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";

export default function CheckoutButton() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);
  const [showSolanaPay, setShowSolanaPay] = useState(false);

  function setOpen() {}

  async function doCheckout(method) {
    switch (method) {
      case "solanaPay": {
        setShowSolanaPay(true);
        break;
      }
      case "applePay": {
        //statements;
        break;
      }
    }
  }

  return (
    <>
      <div className="col-span-6 col-end-13 mt-12">
        <div className="mt-14 sm:mt-0">
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="bg-white px-4 py-5 sm:p-6">
              <h1 className="text-4xl font-extrabold text-black w-full">
                Payment
              </h1>
              <div className="grid grid-cols-6 gap-6">
                <button
                  className="rounded-lg bg-black px-3 py-2"
                  onClick={() => doCheckout("solanaPay")}
                >
                  <img src="/solanapay.svg" alt="Solana Pay" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={showSolanaPay} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-40 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="dark:bg-dark3 text-center p-8 relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <h2 className="tracking-wide text-center my-5 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
                  Complete Your Purchase
                </h2>
                <p className="text-gray-400 mb-12">
                  To setup your account you need to create a username. You can
                  always change this later in your profile.
                </p>
                <p className="text-left text-2xl mb-4 text-gray-600 dark:text-whitish">
                  Username:
                </p>
                <div className="mt-1 flex rounded-md shadow-sm mb-2 border border-gray-200">
                  <span className="py-2 inline-flex items-center pl-3 rounded-l-md bg-white text-gray-300 text-lg dark:bg-dark2 dark:text-gray-600">
                    https://collector.sh/
                  </span>
                  <input
                    id="username"
                    type="text"
                    className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg text-gray-900 dark:text-gray-100 dark:bg-dark2 focus:outline-none focus:shadow-outline"
                  />
                </div>
                <button
                  className="mt-4 py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                  onClick={(e) => setShowSolanaPay(false)}
                >
                  Cancel
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
