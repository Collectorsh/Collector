import React, { useEffect, useContext, useState, useCallback } from "react";
import ActivitiesContext from "/contexts/activities";
import { roundToTwo } from "/utils/roundToTwo";

export default function Activity() {
  const [activities] = useContext(ActivitiesContext);
  console.log(activities);

  return (
    <div className="clear-both mt-6 max-w-screen-2xl mx-auto px-4 sm:px-8 pb-12">
      <table className="relative h-full min-w-full rounded-lg border-gray-100 dark:border-gray-900 border-0 border-separate [border-spacing:0_0.5rem] shadow-sm">
        <thead className="top-[9rem] bg-white dark:bg-dark2">
          <tr>
            <th
              scope="col"
              className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
            >
              Type
            </th>
            <th
              scope="col"
              className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
            >
              Item
            </th>
            <th
              scope="col"
              className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
            >
              Price
            </th>
            <th
              scope="col"
              className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
            >
              Time
            </th>
          </tr>
        </thead>
        {activities.map((item, index) => (
          <tr
            key={index}
            className="bg-transparent dark:bg-dark3 dark:border-0 dark:text-gray-50 h-full lg:hover:shadow-[0_12px_40px_0px_rgba(0,0,0,0.18)] rounded-xl shadow-[0_12px_40px_0px_rgba(0,0,0,0.06)] text-gray-900 ng-star-inserted"
          >
            <td className="py-4 px-6">{item.activityType}</td>
            <td className="py-4 px-6">
              <img
                className="float-left object-center object-cover w-10 h-10"
                src={item.nft.image}
              />
              <div className="ml-12">
                <p>{item.nft.name}</p>
              </div>
            </td>
            <td className="py-4 px-6">
              ◎{roundToTwo(item.price / 1000000000)}
            </td>
            <td className="py-4 px-6">{item.createdAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
