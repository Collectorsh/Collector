import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Gacha from "/components/drops/gacha";

export default function HanaKnight() {
  const address = new PublicKey(process.env.NEXT_PUBLIC_DROP_CANDYMACHINE);

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

            <div className="flex sm:gap-2 mt-6">
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha1.jpeg" />
              </div>
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha2.jpeg" />
              </div>
              <div className="flex-1 h-32 sm:h-44 md:h-52 lg:h-64 text-center overflow-hidden">
                <img src="/images/gacha3.jpeg" />
              </div>
            </div>

            <Gacha address={address} />
          </div>
        </div>
      </div>
    </>
  );
}
