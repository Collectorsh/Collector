import React, { useContext, useEffect, useState } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveConfig from "/data/hubs/saveConfig";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { Oval } from "react-loader-spinner";

export default function Settings({ hub, updateConfig }) {
  const wallet = useWallet();
  const [user, setUser] = useContext(UserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basisPoints, setBasisPoints] = useState(0);
  const [auctionHouse, setAuctionHouse] = useState();
  const [updating, setUpdating] = useState(false);

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));

  const getAuctionHouseFromAddress = async (address) => {
    const ah = await metaplex.auctionHouse().findByAddress({
      address: new PublicKey(address),
    });
    setAuctionHouse(ah);
    setBasisPoints(ah.sellerFeeBasisPoints);
  };

  useEffect(() => {
    setName(hub.name);
    setDescription(hub.description);
    if (hub.auction_house) getAuctionHouseFromAddress(hub.auction_house);
  }, [hub]);

  const getAuctionHouse = async () => {
    if (auctionHouse) return auctionHouse;
    try {
      let ah = await metaplex.auctionHouse().findByCreatorAndMint({
        creator: wallet.publicKey,
        treasuryMint: new PublicKey(
          "So11111111111111111111111111111111111111112"
        ),
      });
      setAuctionHouse(ah);
      return ah;
    } catch (err) {
      let ah = await metaplex
        .auctionHouse()
        .create({ sellerFeeBasisPoints: basisPoints });
      setAuctionHouse(ah.auctionHouse);
      return ah.auctionHouse;
    }
  };

  const updateAuctionHouse = async (ahouse) => {
    let ah = await metaplex
      .auctionHouse()
      .update({ auctionHouse: ahouse, sellerFeeBasisPoints: basisPoints });
    setAuctionHouse(ah.auctionHouse);
  };

  const saveAll = async () => {
    setUpdating(true);
    const ah = await getAuctionHouse();
    if (ah.sellerFeeBasisPoints !== basisPoints) await updateAuctionHouse(ah);
    const res = await saveConfig(
      user.api_key,
      name,
      description,
      ah.address.toBase58()
    );
    if (res.status === "success") {
      success("Updated successfully");
      updateConfig(res.hub);
    } else {
      error(res.msg);
    }
    setUpdating(false);
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
                {updating ? (
                  <>
                    <Oval
                      color="#fff"
                      secondaryColor="#000"
                      height={30}
                      width={30}
                      className="p-0 m-0"
                    />
                  </>
                ) : (
                  <button
                    className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                    onClick={(e) => saveAll(e)}
                  >
                    Save
                  </button>
                )}
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
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
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
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-neutral-800 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      Description of your curated hub
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
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
                        value={basisPoints / 100}
                        onChange={(e) => setBasisPoints(e.target.value * 100)}
                        className="block w-fit rounded-none rounded-r-md sm:text-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline p-2"
                      />
                    </div>
                    <div className="text-gray-500">
                      The percentage of the sale that you will receive as a
                      curator fee
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                  <dt className="text-sm font-medium text-gray-500">
                    Auction House
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center w-full mb-2">
                      {hub.auction_house ? (
                        <p className="text-black dark:text-white">
                          {hub.auction_house}
                        </p>
                      ) : (
                        <p className="text-black dark:text-white">
                          When you save your configuration you&apos;ll be
                          prompted to create your auction house
                        </p>
                      )}
                    </div>
                    <div className="text-gray-500">
                      Your Auction House instance
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
