import React, { useContext } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveConfig from "/data/hubs/saveConfig";
import { PublicKey } from "@solana/web3.js";

export default function Settings({ hub, updateConfig }) {
  const [user, setUser] = useContext(UserContext);

  const saveAll = async () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const wallet = document.getElementById("wallet").value;
    const royalty = document.getElementById("royalty").value * 100;
    try {
      var owner = new PublicKey(wallet);
    } catch (err) {
      error(err.message);
      return;
    }
    if (!PublicKey.isOnCurve(owner.toBytes())) {
      error("Invalid wallet address");
      return;
    }
    if (!name || !description || !wallet || !royalty) {
      error("All fields are required");
      return;
    }
    const res = await saveConfig(user.api_key, {
      name: name,
      description: description,
      wallet: wallet,
      fee: royalty,
    });
    if (res.status === "success") {
      success("Updated successfully");
      updateConfig(res.hub);
    } else {
      error(res.msg);
    }
  };

  return (
    <>
      <Toaster />
      <div className="mt-8 pb-12">
        {!hub.name && (
          <div className="clear-both mt-10 border border-red-200 bg-red-100 rounded-lg text-red-800 font-bold px-3 py-2">
            You need to complete your configuration to get started
          </div>
        )}
        <div className="clear-both mt-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                Hub Configuration
              </h3>
              <div className="float-right align-middle -mt-3">
                <button
                  className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                  onClick={(e) => saveAll(e)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-dark3">
              <dl>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        defaultValue={hub.name}
                        className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      Name of your curated hub
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      <input
                        id="description"
                        type="text"
                        placeholder="Description"
                        defaultValue={hub.description}
                        className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-neutral-800 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      Description of your curated hub
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                  <dt className="text-sm font-medium text-gray-500">Wallet</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      <input
                        id="wallet"
                        type="text"
                        placeholder="Wallet address"
                        defaultValue={hub.wallet}
                        className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      Wallet address to receive curator fee
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                  <dt className="text-sm font-medium text-gray-500">
                    Curator Fee
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      <input
                        type="number"
                        max="100"
                        min="0"
                        name="royalty"
                        id="royalty"
                        defaultValue={
                          hub.basis_points ? hub.basis_points / 100 : 0
                        }
                        className="block w-fit rounded-none rounded-r-md sm:text-lg dark:bg-neutral-800 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      The percentage of the sale that you will receive as a
                      curator fee
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
