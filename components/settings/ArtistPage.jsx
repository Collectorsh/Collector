import React, { useContext, useState } from "react";
import UserContext from "/contexts/user";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import saveMints from "/data/user/saveMints";
import saveUser from "/data/user/saveUser";
import { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { success, error } from "/utils/toastMessages";

export default function ArtistPage() {
  const [user, setUser] = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection);

  const saveAll = async (message = true) => {
    const enabled = document.getElementById("enabled").value;
    const publicKey = document.querySelector(
      'input[name="minting_wallet"]:checked'
    ).value;
    console.log(publicKey);
    await saveUser(user.api_key, { artist: enabled, public_key: publicKey });
    if (message) success("User updated successfully");
  };

  const refreshNow = async () => {
    await saveAll(false);
    try {
      setRefreshing(true);
      var mints = [];
      const nfts = await metaplex.nfts().findAllByCreator({
        creator: new PublicKey("B19qdEHeYmjtbiCzeXbkwAGF9KCwRK85biAHKU9Hx8Sv"),
      });
      for (const metadata of nfts) {
        var nft;
        if (metadata.jsonLoaded === true) {
          nft = metadata;
        } else {
          nft = await metaplex.nfts().load({ metadata });
        }
        if (nft.edition.isOriginal === true) {
          const mint = {
            name: nft.json.name,
            description: nft.json.description,
            image: nft.json.image,
            uri: nft.uri,
            symbol: nft.symbol,
            address: nft.address.toBase58(),
            mint: nft.mint.address.toBase58(),
          };
          if (nft.edition.isOriginal === true) {
            mint.edition_type = "master";
            mint.supply = nft.edition.supply;
            mint.max_supply = nft.edition.maxSupply;
          }
          if (nft.collection && nft.collection.verified === true) {
            mint.collection = nft.collection.address.toBase58();
          }
          mints.push(mint);
        }
      }
      const res = await saveMints(user.api_key, mints);
      setRefreshing(false);
      if (res.data.status === "error") {
        error(res.data.msg);
      } else {
        success("Mints updated successfully");
      }
    } catch (err) {
      console.log(err);
      error(err);
      setRefreshing(false);
    }
  };

  return (
    <>
      <Toaster />
      <div>
        <div className="mt-8 lg:mt-16 pb-12">
          {user && (
            <div className="clear-both mt-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                    Artist Page
                  </h3>
                  <div className="float-right align-middle -mt-3">
                    <button
                      className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                      onClick={() => saveAll()}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-dark3">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Enable Artist Page
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="enabled"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="enabled"
                              className="sr-only"
                              defaultChecked={user.artist}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Enable your Artist Page
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Select Minting Wallet
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="minting_wallet"
                            className="cursor-pointer relative mb-4"
                          >
                            {user.public_keys.map((key, index) => (
                              <div key={index} className="mt-2 w-full block">
                                <input
                                  className="align-middle  form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-greeny checked:border-greeny focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                  type="radio"
                                  name="minting_wallet"
                                  id="minting_wallet"
                                  value={key}
                                  defaultChecked={key == user.public_key}
                                />
                                <p className="inline ml-2 align-middle">
                                  {key}
                                </p>
                              </div>
                            ))}
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Select your main minting wallet from your connected
                          wallets
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Refresh Collections/Mints
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          {refreshing ? (
                            <Oval
                              color="#fff"
                              secondaryColor="#000"
                              height={30}
                              width={30}
                              className="p-0 m-0"
                            />
                          ) : (
                            <button
                              className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                              onClick={() => refreshNow()}
                            >
                              Refresh
                            </button>
                          )}
                        </div>
                        {refreshing ? (
                          <div className="text-gray-500">
                            Please be patient as this could take 1-2 minutes
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            You need to run this to fetch and update your mints.
                            Last run {user.mint_refresh || "Never"}
                          </div>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
