import React, { useEffect, useContext, useState, useCallback } from "react";
import UserContext from "/contexts/user";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Listings from "/components/hubs/Listings";
import Activity from "/components/hubs/Activity";
import List from "/components/hubs/List";
import { useLazyQuery } from "@apollo/client";
import { getActivitiesQuery } from "/queries/activities";
import ActivitiesContext from "/contexts/activities";
import { Oval } from "react-loader-spinner";

export default function CuratorHub({ hub, allowed_users }) {
  const [activities, setActivities] = useContext(ActivitiesContext);
  const [listings, setListings] = useState();
  const [user] = useContext(UserContext);
  const [backgroundImage, setBackgroundImage] = useState();
  const [canList, setCanList] = useState(false);
  const [selected, setSelected] = useState("listings");
  const [loading, setLoading] = useState(false);

  // Query to get activities by auctionhouse
  const [getActivitiesQl] = useLazyQuery(getActivitiesQuery, {
    fetchPolicy: "network-only",
  });

  const fetchActivities = useCallback(async (hub) => {
    setLoading(true);
    const res = await getActivitiesQl({
      variables: {
        auctionhouses: [hub.auction_house],
      },
    });
    var activs = res.data.activities.filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );
    activs = activs.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0
    );
    setActivities(activs);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities(hub);
  }, [hub]);
  /////////////////////////////////////////////////////////////////////////////////////////

  // Filter activities for the active listings
  useEffect(() => {
    if (!activities) return;
    let lstns = activities.filter(
      (a) => a.activityType === "listing" && !a.cancelledAt
    );
    setListings(lstns);
    // Fetch visible listings and order from api
    // fetchHubListings(lstns, hub.id)
  }, [activities, hub]);
  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!user) return;
    setCanList(allowed_users.includes(user.id));
  }, [allowed_users, user]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const refetch = (token) => {
    console.log("here for refetch");
    // fetchActivities(hub);
  };

  return (
    <>
      <div className="relative bg-black overflow-hidden">
        <div
          className="absolute -top-40 -left-20 -bottom-40 -right-20 opacity-40 object-center object-cover rotate-12"
          style={{
            backgroundImage: `url('https://cdn.collector.sh/${
              backgroundImage && backgroundImage
            }')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="h-96 lg:h-80 relative max-w-screen-2xl mx-auto px-4 sm:px-8 relative">
          <div className="float-left mt-4 sm:mt-12 w-full">
            <h1 className="text-3xl font-bold inline-block tracking-wide text-white">
              {hub.name}
            </h1>
            <p className="mt-4 text-white rounded xl:w-1/2">
              {hub.description}
            </p>
          </div>
          <Menu as="div" className="absolute bottom-1 right-2">
            <div>
              <Menu.Button className="inline-flex justify-center focus:outline-none">
                <DotsHorizontalIcon
                  className="h-6 w-6 inline cursor-pointer text-white"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-bottom-right absolute right-2 bottom-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href=""
                        target="_blank"
                        rel="noreferrer"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm cursor-pointer"
                        )}
                      >
                        View Allowlist
                      </a>
                    )}
                  </Menu.Item>
                  {canList && (
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm cursor-pointer"
                          )}
                          onClick={() => setSelected("list")}
                        >
                          List on Hub
                        </span>
                      )}
                    </Menu.Item>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="clear-both mt-6 w-full">
        <div className="border-b border-t border-neutral-100 dark:border-neutral-800 py-6 text-center">
          <ul className="list-none">
            <li
              className={`inline cursor-pointer ${
                selected === "listings" &&
                "font-semibold border-b border-b-2 border-greeny"
              }`}
              onClick={() => setSelected("listings")}
            >
              Listings
            </li>
            <li className="mx-3 inline">&middot;</li>
            <li
              className={`inline cursor-pointer ${
                selected === "activity" &&
                "font-semibold border-b border-b-2 border-greeny"
              }`}
              onClick={() => setSelected("activity")}
            >
              Activity
            </li>
            {canList && (
              <>
                <li className="mx-3 inline">&middot;</li>
                <li
                  className={`inline cursor-pointer ${
                    selected === "list" &&
                    "font-semibold border-b border-b-2 border-greeny"
                  }`}
                  onClick={() => setSelected("list")}
                >
                  List
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {loading ? (
        <div className="w-fit mx-auto mt-6">
          <Oval
            color="#fff"
            secondaryColor="#000"
            height={30}
            width={30}
            className="p-0 m-0"
          />
        </div>
      ) : (
        <>
          {selected === "listings" && <Listings listings={listings} />}
          {selected === "activity" && <Activity />}
          {selected === "list" && <List hub={hub} refetch={refetch} />}
        </>
      )}
    </>
  );
}
