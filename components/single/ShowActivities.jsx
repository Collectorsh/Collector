import React, { useContext } from "react";
import { roundToTwo } from "/utils/roundToTwo";
import { host } from "/config/settings";
import Moment from "react-moment";
import ActivitiesContext from "/contexts/activities";

export default function ShowActivities() {
  const [activities] = useContext(ActivitiesContext);

  function formatWalletAddress(wallet) {
    if (wallet.profile && wallet.profile.handle) {
      const handle = `@${wallet.profile.handle}`;
      return (
        <a
          href={`https://twitter.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          title=""
        >
          {handle}
        </a>
      );
    } else {
      const address = `${wallet.address.substr(0, 4)}...${wallet.address.slice(
        -4
      )}`;
      return (
        <a
          href={`${host}/search/${wallet.address}`}
          target="_blank"
          rel="noreferrer"
          title=""
        >
          {address}
        </a>
      );
    }
  }

  if (activities.length === 0) return null;

  return (
    <>
      <h4 className="text-lg text-black dark:text-white uppercase mt-10 lg:mt-12">
        Activities
      </h4>
      <div className="flex flex-col">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full sm:mx-6 lg:mx-8 max-h-96 overflow-auto">
            <table className="min-w-full overflow-auto">
              <thead className="top-[9rem]">
                <tr>
                  <th
                    scope="col"
                    className="text-left text-button-lg font-semibold py-4 text-gray-600 dark:text-gray-400"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="text-left text-button-lg font-semibold py-4 text-gray-600 dark:text-gray-400"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="text-left text-button-lg font-semibold py-4 text-gray-600 dark:text-gray-400"
                  >
                    Seller
                  </th>
                  <th
                    scope="col"
                    className="text-left text-button-lg font-semibold py-4 text-gray-600 dark:text-gray-400"
                  >
                    Buyer
                  </th>
                  <th
                    scope="col"
                    className="text-left text-button-lg font-semibold py-4 text-gray-600 dark:text-gray-400"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, index) => (
                  <tr className="border-b dark:border-dark3" key={index}>
                    <td className="py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">
                      {a.activityType}
                    </td>
                    {a.activityType === "purchase" && (
                      <>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          ◎ {roundToTwo(a.price / 1000000000)}
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          <a
                            href={`https://solscan.io/account/${a.nft.mintAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            title=""
                          >
                            {formatWalletAddress(a.wallets[0])}
                          </a>
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          <a
                            href={`https://solscan.io/account/${a.nft.mintAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            title=""
                          >
                            {formatWalletAddress(a.wallets[1])}
                          </a>
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          <Moment
                            date={a.createdAt}
                            format="MMMM Do YYYY H:mm"
                          />
                        </td>
                      </>
                    )}
                    {a.activityType === "listing" && (
                      <>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          ◎ {roundToTwo(a.price / 1000000000)}
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          <a
                            href={`https://solscan.io/account/${a.nft.mintAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            title=""
                          >
                            {formatWalletAddress(a.wallets[0])}
                          </a>
                        </td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200"></td>
                        <td className="py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-200">
                          <Moment
                            date={a.createdAt}
                            format="MMMM Do YYYY H:mm"
                          />
                        </td>
                      </>
                    )}
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
