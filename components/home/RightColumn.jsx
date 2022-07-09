import React, { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import getMostWins from "/data/home/getMostWins";
import getMarketplaceStats from "/data/home/getMarketplaceStats";
import getMostFollowedArtists from "/data/home/getMostFollowedArtists";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import MarketplaceLogo from "/components/MarketplaceLogo";
import UserContext from "/contexts/user";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

export default function RightColumn() {
  const [user, setUser] = useContext(UserContext);
  const [mostWins, setMostWins] = useState();
  const [marketplaceStats, setMarketplaceStats] = useState();
  const [mostFollowedArtists, setMostFollowedArtists] = useState();

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  const fetchMostWins = useCallback(async () => {
    let res = await getMostWins();
    setMostWins(res.data);
  }, []);

  const fetchMarketplaceStats = useCallback(async () => {
    let res = await getMarketplaceStats();
    setMarketplaceStats(res.data);
  }, []);

  const fetchMostFollowedArtists = useCallback(async () => {
    let res = await getMostFollowedArtists();
    setMostFollowedArtists(res.data);
  }, []);

  useEffect(() => {
    fetchMostWins();
    fetchMarketplaceStats();
    fetchMostFollowedArtists();
  }, []);

  return (
    <>
      {mostWins && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Last 7 days
          </h2>
          {mostWins.map((item, index) => (
            <div key={index} className="mt-4">
              <div className="float-left w-11/12">
                {item.user.twitter_profile_image ? (
                  <img
                    src={item.user.twitter_profile_image}
                    className="w-12 h-12 mr-2 rounded-full float-left mb-4"
                  />
                ) : (
                  <div className="w-12 h-12 mr-2 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                )}

                <div className="mb-0">
                  {item.user.username && (
                    <p className="inline mr-2">
                      <CollectorUsername username={item.user.username} />
                    </p>
                  )}
                </div>
                <p className="text-sm dark:text-whitish">
                  {item.wins} auctions won
                </p>
              </div>

              <div className="float-right mt-2">
                {user && item.user.id && user.id !== item.user.id && (
                  <>
                    {user.following &&
                    user.following.find((f) => f.id === item.user.id) ? (
                      <Tippy
                        content={`Stop following ${item.user.username}`}
                        className="bg-gray-300"
                      >
                        <MinusCircleIcon
                          className="h-8 w-8 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-red-600 dark:hover:text-red-600"
                          aria-hidden="true"
                          onClick={() => followUser(item.user.id, "unfollow")}
                        />
                      </Tippy>
                    ) : (
                      <Tippy
                        content={`Follow ${item.user.username}`}
                        className="bg-gray-300"
                      >
                        <PlusCircleIcon
                          className="h-8 w-8 cursor-pointer outline-none text-greeny hover:text-black dark:hover:text-white"
                          aria-hidden="true"
                          onClick={() => followUser(item.user.id, "follow")}
                        />
                      </Tippy>
                    )}
                  </>
                )}
              </div>

              <div className="clear-both"></div>
            </div>
          ))}
        </div>
      )}

      {mostFollowedArtists && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2 mt-6">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Most Followed Artists
          </h2>
          {mostFollowedArtists.map((item, index) => (
            <div key={index} className="mt-4">
              <div className="float-left w-11/12">
                {item.artist.twitter_profile_image ? (
                  <img
                    src={item.artist.twitter_profile_image}
                    className="w-12 h-12 mr-2 rounded-full float-left mb-4"
                  />
                ) : (
                  <div className="w-12 h-12 mr-2 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                )}

                <div className="mb-0">
                  {item.artist.name && (
                    <p className="inline mr-2 dark:text-whitish">
                      <Link
                        href={`https://twitter.com/${item.artist.twitter}`}
                        title=""
                      >
                        <a className="font-bold hover:underline">
                          <span className="px-0.5 dark:text-white">
                            {item.artist.name}
                          </span>
                        </a>
                      </Link>
                    </p>
                  )}
                </div>
                <p className="text-sm dark:text-whitish">
                  {item.followers} followers
                </p>
              </div>
              <div className="clear-both"></div>
            </div>
          ))}
        </div>
      )}

      {marketplaceStats && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2 mt-6">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Marketplaces 7 days
          </h2>
          {marketplaceStats.map((item, index) => (
            <div key={index} className="mt-4">
              <MarketplaceLogo source={item.name} />
              <dl className="mt-4">
                <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Auctions
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-1">
                    {item.auctions}
                  </dd>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-1">
                    ◎{roundToTwo(item.auction_total / 1000000000)}
                  </dd>
                </div>
                <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Instant Sales
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-1">
                    {item.sales}
                  </dd>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-1">
                    ◎{roundToTwo(item.sales_total / 1000000000)}
                  </dd>
                </div>
                <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Volume</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-1 sm:col-start-3">
                    ◎{roundToTwo(item.total / 1000000000)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
