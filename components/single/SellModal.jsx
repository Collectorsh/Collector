import { Fragment, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import sellNftTransaction from "/utils/auctionhouse/SellNft";
import { Oval } from "react-loader-spinner";
import UserContext from "/contexts/user";

export default function SellModal({ open, token, closeModal, refetch }) {
  const { publicKey, signTransaction } = useWallet();
  const [processing, setProcessing] = useState(false);
  const { setVisible } = useWalletModal();
  const [user] = useContext(UserContext);

  function setOpen() {}

  const listNow = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    const amount = document.getElementById("amount").value;
    setProcessing(true);
    await sellNftTransaction(
      amount,
      token,
      publicKey,
      signTransaction,
      refetch,
      user && user.token_holder
    );
    setProcessing(false);
    closeModal();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
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
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center">
                    <img
                      src={token.image}
                      className="w-64 h-64 object-cover object-center"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      List Now
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{token.name}</p>
                      <p className="text-sm text-gray-500 mt-4">Amount:</p>
                      <input
                        type="number"
                        step="1"
                        min="0.0000"
                        name="amount"
                        id="amount"
                        className="w-full rounded-lg px-4 py-3 bg-gray-50 border border-gray-400 text-black"
                      />
                      <button
                        className={`w-full mt-4 bg-black text-white rounded-lg px-4 py-4 ${
                          processing && "py-0"
                        }`}
                        name="list"
                        onClick={listNow}
                        disabled={processing}
                      >
                        {processing ? (
                          <div className="w-[50px] my-0 p-0 mx-auto">
                            <Oval
                              color="#fff"
                              secondaryColor="#000"
                              height={50}
                              width={50}
                              className="p-0 m-0"
                            />
                          </div>
                        ) : (
                          <span>List Now</span>
                        )}
                      </button>
                      <button
                        className="w-full mt-4 bg-white border border-4 border-black text-black rounded-lg px-3 py-3"
                        name="list"
                        onClick={closeModal}
                      >
                        <span>Nevermind</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
