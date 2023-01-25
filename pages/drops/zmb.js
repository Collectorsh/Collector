import Link from "next/link";
import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Zmb from "/components/drops/zmb";

export default function HanaKnight() {
  const address = new PublicKey("EwKd7ECeymoBDdRJGCfHZz3Etf895fawod89usU2yitv");

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
                  src="/images/zmb.jpeg"
                  className="inline w-16 h-16 align-middle rounded-full"
                />
                <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                  Zero Monke Biz
                </h2>
                <p className="mt-4">
                  1/1 PFP project of 4,269 hand drawn monkes. Each monke is hand
                  drawn by Solana based 1/1 artist{" "}
                  <Link href="https://twitter.com/ohareyoufat">
                    <a target="_blank">@ohareyoufat</a>
                  </Link>
                  .
                </p>
                <p className="mt-4">Wave 1: 1,069 pfp monkes</p>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0 sm:col-span-4 sm:col-end-13">
                <Zmb address={address} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              <img src="/images/zmb1.jpeg" />
              <img src="/images/zmb2.jpeg" />
              <img src="/images/zmb3.jpeg" />
              <img src="/images/zmb4.jpeg" />
              <img src="/images/zmb5.jpeg" />
              <img src="/images/zmb6.jpeg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
