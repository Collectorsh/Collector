import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import BonkMint from "/components/drops/bonk";

export default function Bonk() {
  const address = new PublicKey("DGp59LKAGV9NtMXNGq7aZwxCALwqGJyGXFBjyQHoreW8");

  const bonkImages = () => {
    const rows = [];
    for (let i = 1; i < 7; i++) {
      rows.push(
        <img
          key={i}
          src={`https://cdn.collector.sh/drops/bonk/${i.toString()}.png`}
          className="h-64 w-full object-center object-cover"
        />
      );
    }
    return rows;
  };

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
                  src="/images/bonk.jpeg"
                  className="inline w-16 h-16 align-middle rounded-full"
                />
                <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                  Bonk Community Drop
                </h2>
                <p className="mt-4">
                  A bonk community art drop that was open to all artists on
                  Solana to submit their work. 50% of bonk will be burned and
                  the other 50% will be distributed equally amoung the artists.
                </p>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0 sm:col-span-4 sm:col-end-13">
                <BonkMint address={address} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              {bonkImages()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
