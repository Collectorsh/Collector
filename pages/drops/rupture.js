import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import RuptureMint from "/components/drops/rupture";

export default function Rupture() {
  const address = new PublicKey("EcoXnSV98kW8dEY837HhqTVT6ZEMnYgofquEHUVmfnrR");

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
          <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="col-span-1 sm:col-span-7">
                <img
                  src="/images/monochromatic.png"
                  className="inline w-16 h-16 align-middle rounded-full"
                />
                <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                  Monochromatic Dreams
                </h2>
                <p className="mt-4">Curated by Rupture</p>
                <p className="mt-4">7 artists, 15 editions each.</p>
                <p className="mt-4">
                  Featuring Holly Herbert, Laurence Antony, Lisanne Haack,
                  Rupture, Sleepr, Space Case and Tony Tafuro.
                </p>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0 sm:col-span-4 sm:col-end-13">
                <RuptureMint address={address} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/B19qdEHeYmjtbiCzeXbkwAGF9KCwRK85biAHKU9Hx8Sv.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Laurence Antony</p>
                <p className="underline">Bleu Nuit</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/GBDtAqKHmwgLLP1aT9ewNV2JmA8hyRGn7ti1TV3dxWM2.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Rupture</p>
                <p className="underline">Oblivious</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/AjW4NNcwVA8LHaGfrisdbMnqPfkFfYZdCtztTikQ8NRN.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Tony Tafuro</p>
                <p className="underline">Your Fantasy </p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/H78kBdBzioQn1HKPgGhp5wF9bJ7dvEQRSaHomwnxmJtp.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Sleepr</p>
                <p className="underline">Neckdeep In Voodoo</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/HYzRfSo6iVNoPmD43jfpUU1d4EwHPEgwC5MsRrExAMbp.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Lisanne Haack</p>
                <p className="underline">In the search of the missing piece</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/9W5QWbdDjTS7ExLWhfrQb86QmsL59EacHC1LShHGwE7A.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">Holly Herbert</p>
                <p className="underline">The End</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
              <div className="text-center">
                <img
                  src="https://cdn.collector.sh/drops/rupture/rtoDoDPnULqmJJYavfEjr2SGowWShr5cDBs8TPeLnQc.png"
                  className="w-full h-96 lg:h-64 object-center object-cover"
                />
                <p className="font-bold">ADHD (Space Case)</p>
                <p className="underline">Growing Up</p>
                <p className="text-sm mt-2">Editions: 15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
