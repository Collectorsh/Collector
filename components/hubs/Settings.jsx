import React, { useContext } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";

export default function Settings({ curator }) {
  const [user, setUser] = useContext(UserContext);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection);

  const createAuctionHouse = async () => {
    const res = await metaplex
      .auctionHouse()
      .create({ sellerFeeBasisPoints: 500 });
    console.log(res);
  };

  return (
    <>
      <Toaster />
      <div className="mt-8">
        {!curator.auction_house && (
          <div className="clear-both mt-10 border border-red-200 bg-red-100 rounded-lg text-red-800 font-bold px-3 py-2">
            You need to complete your configuration before adding artists
          </div>
        )}
        <div className="clear-both mt-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                Hub Configuration
              </h3>
              <div className="float-right align-middle -mt-3">
                <button className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold">
                  Save
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-dark3">
              <dl>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                  <dt className="text-sm font-medium text-gray-500">
                    Auction House
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      <button
                        onClick={() => createAuctionHouse()}
                        className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                      >
                        Create
                      </button>
                    </div>
                    <div className="text-gray-500">
                      If selected images in your gallery will have a border
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
