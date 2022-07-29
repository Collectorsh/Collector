import React, { useContext } from "react";
import Link from "next/link";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import CollectorUsername from "/components/CollectorUsername";
import Moment from "react-moment";
import Image from "/components/Image";
import { CogIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import saveUser from "/data/user/saveUser";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import ShowOffers from "/components/gallery/ShowOffers";

export default function GridView({
  items,
  type,
  profileUser,
  refreshProfileImage,
  showOffers,
}) {
  const [user, setUser] = useContext(UserContext);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const setProfileImage = async (item) => {
    const res = await saveUser(user.api_key, {
      profile_image: item.attributes.image,
    });
    if (res.data.status === "success") {
      success("Profile image saved");
      refreshProfileImage(item.attributes.image);
    } else if (res.data.status === "error") {
      error(res.data.msg);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
      <Toaster />
      {items.map((item, index) => (
        <div
          key={index}
          className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3"
        >
          <div className="rounded-lg overflow-hidden">
            {type === "listing" && (
              <Link
                href={marketplaceLink(item.source, item.mint, item.artist_name)}
              >
                <a>
                  <Image token={item} />
                </a>
              </Link>
            )}
            {type === "collected" && (
              <Link href={`/nft/${item.attributes.mint}`}>
                <a>
                  <Image
                    token={{
                      image: item.attributes.image,
                      mint: item.attributes.mint,
                    }}
                  />
                </a>
              </Link>
            )}
            {type === "auction" && (
              <Link
                href={marketplaceLink(
                  item.source,
                  item.mint,
                  item.brand_name,
                  item.highest_bidder_username
                )}
              >
                <a>
                  <Image token={item} />
                </a>
              </Link>
            )}
          </div>
          <div>
            <div className="w-full">
              <div className="h-12 my-1">
                <h3 className="text-md text-black dark:text-whitish font-medium">
                  {item.name || (item.attributes && item.attributes.name)}
                </h3>
                {item.brand_name && (
                  <p className="dark:text-whitish text-xs">{item.brand_name}</p>
                )}
                {type === "listing" && (
                  <div className="clear-both mt-0.5">
                    {item.twitter_profile_image && (
                      <img
                        src={item.twitter_profile_image}
                        className="w-4 h-4 mr-1 rounded-full float-left"
                      />
                    )}
                    {item.artist_name && (
                      <p className="dark:text-whitish text-xs mb-2">
                        @{item.artist_name}
                      </p>
                    )}
                  </div>
                )}
                {type === "collected" &&
                  item.type === "sale" &&
                  item.attributes.artist_name && (
                    <p className="dark:text-whitish text-xs">
                      @{item.attributes.artist_name}
                    </p>
                  )}
                {type === "collected" &&
                  item.type == "won" &&
                  item.attributes.brand_name && (
                    <p className="dark:text-whitish text-xs">
                      @{item.attributes.brand_name}
                    </p>
                  )}
              </div>

              <div className="bg-black rounded-b-2xl px-[10px] py-3 text-gray-50 -mx-[10px] h-16">
                <div className="text-sm">
                  {type === "listing" && (
                    <div className="font-black dark:text-whitish mt-1 float-left">
                      ◎{roundToTwo(item.amount / 1000000000)}
                    </div>
                  )}
                  {type === "auction" && (
                    <span className="font-black dark:text-whitish">
                      ◎
                      {roundToTwo(
                        (item.highest_bid || item.reserve) / 1000000000
                      )}
                    </span>
                  )}
                  {type === "collected" && item.type == "won" && (
                    <span className="font-black dark:text-whitish">
                      ◎{roundToTwo(item.attributes.highest_bid / 1000000000)}
                    </span>
                  )}
                  {type === "collected" && item.type === "sale" && (
                    <span className="font-black dark:text-whitish">
                      ◎{roundToTwo(item.attributes.amount / 1000000000)}
                    </span>
                  )}
                  {type === "collected" && (
                    <div className="float-right">
                      <MarketplaceLogo
                        source={item.attributes.source}
                        color="white"
                      />
                    </div>
                  )}
                  {type === "listing" && (
                    <div className="float-right mt-1">
                      <MarketplaceLogo source={item.source} color="white" />
                    </div>
                  )}
                  {type === "auction" && (
                    <div className="float-right">
                      <MarketplaceLogo source={item.source} color="white" />
                      <div className="mt-1 text-right dark:text-whitish">
                        {item.number_bids}{" "}
                        {item.number_bids === 1 ? "bid" : "bids"}
                      </div>
                    </div>
                  )}
                </div>
                {type === "auction" && (
                  <p className="text-xs mt-2 dark:text-whitish">
                    Ends <Moment date={item.end_time} unix fromNow />
                  </p>
                )}
              </div>
            </div>
          </div>
          {type === "collected" &&
            user &&
            profileUser &&
            profileUser.id === user.id && (
              <Menu as="div" className="absolute top-4 right-4">
                <div>
                  <Menu.Button className="inline-flex justify-center focus:outline-none">
                    <CogIcon
                      className="h-6 w-6 inline cursor-pointer text-gray-200"
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={(e) => setProfileImage(item)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm cursor-pointer"
                            )}
                          >
                            Set as profile image
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          {showOffers && <ShowOffers token={item} />}
        </div>
      ))}
    </div>
  );
}
