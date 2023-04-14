import React, { useContext, useEffect, useCallback } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import { host } from "/config/settings";
import moment from "moment";
import ActivitiesContext from "/contexts/activities";
import getActivities from "/data/single/getActivities";
import { auctionHousesArray } from "/config/settings";

export default function ShowActivities({ token }) {
  const auctionHouses = auctionHousesArray.map((a) => a.address);
  const [activities, setActivities] = useContext(ActivitiesContext);

  const fetchActivities = useCallback(async () => {
    const res = await getActivities(token.mint);
    setActivities(res.data);
  }, []);

  useEffect(() => {
    fetchActivities();
  }, []);

  function formatWalletAddress(user) {
    if (!user.wallet) return;
    const address = `${user.wallet.substr(0, 4)}...${user.wallet.slice(-4)}`;
    return (
      <a
        href={`${host}/search/${user.wallet}`}
        target="_blank"
        rel="noreferrer"
        title=""
      >
        {user.username ? user.username : address}
      </a>
    );
  }

  if (activities.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl text-black dark:text-white mt-10 lg:mt-12 pb-2 border-b border-neutral-100 dark:border-neutral-900">
        Sales
      </h2>
      <div className="flex flex-col">
        <div className="">
          <div className="">
            <table className="min-w-full overflow-auto text-left">
              <thead className="bg-white dark:bg-dark2">
                <tr>
                  <th
                    scope="col"
                    className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200"
                  >
                    Buyer
                  </th>
                  <th
                    scope="col"
                    className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200"
                  >
                    Marketplace
                  </th>
                  <th
                    scope="col"
                    className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, index) => (
                  <tr className="" key={index}>
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                      ◎ {roundToTwo(a.price)}
                    </td>
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                      <a
                        href={`https://solscan.io/account/${a.nftMint}`}
                        target="_blank"
                        rel="noreferrer"
                        title=""
                      >
                        {formatWalletAddress(a.buyer)}
                      </a>
                    </td>
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                      {auctionHouses.includes(a.marketplace)
                        ? "Collector"
                        : a.marketplace}
                    </td>
                    <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                      {moment.unix(a.blockTime).format("MMMM Do YYYY H:mm")}
                      {/* <Moment unix={a.blockTime} format="MMMM Do YYYY H:mm" /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
