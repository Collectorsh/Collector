import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Gacha from "/components/drops/gacha";

export default function HanaKnight() {
  const address = new PublicKey("5jQzX39pie5SM6kVN7f2MzLwDG3rYVQaHfCvR1NkQbPh");

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white">
            <img
              src="/images/hanaknight.jpeg"
              className="inline w-16 h-16 align-middle rounded-full"
            />
            <h2 className="sm:ml-4 align-middle sm:inline my-5 text-4xl font-bold text-gray-800 w-full py-1 inline-block">
              Hana Knight
            </h2>

            <p className="mt-4">Description...</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              <div className="text-center">
                <img
                  src="/images/hanaknight1.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Hana Knight</p>
                <p className="underline">01: Healer, Reaper</p>
                <p className="text-sm mt-2">Editions: 50</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/hanaknight1.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Hana Knight</p>
                <p className="underline">01: Healer, Reaper</p>
                <p className="text-sm mt-2">Editions: 50</p>
              </div>
              <div className="text-center">
                <img
                  src="/images/hanaknight1.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Hana Knight</p>
                <p className="underline">01: Healer, Reaper</p>
                <p className="text-sm mt-2">Editions: 50</p>
              </div>
            </div>

            <Gacha address={address} />
          </div>
        </div>
      </div>
    </>
  );
}
