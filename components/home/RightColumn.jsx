import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getMostWins from "/data/home/getMostWins";
import getMostFollowers from "/data/home/getMostFollowers";
import getMostFollowedArtists from "/data/home/getMostFollowedArtists";
import CollectorUsername from "/components/CollectorUsername";

export default function RightColumn() {
  const [mostWins, setMostWins] = useState();
  const [mostFollowers, setMostFollowers] = useState();
  const [mostFollowedArtists, setMostFollowedArtists] = useState();

  const fetchMostWins = useCallback(async () => {
    let res = await getMostWins();
    setMostWins(res.data);
  }, []);

  const fetchMostFollowers = useCallback(async () => {
    let res = await getMostFollowers();
    setMostFollowers(res.data);
  }, []);

  const fetchMostFollowedArtists = useCallback(async () => {
    let res = await getMostFollowedArtists();
    setMostFollowedArtists(res.data);
  }, []);

  useEffect(() => {
    fetchMostWins();
    fetchMostFollowers();
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
              <div className="clear-both"></div>
            </div>
          ))}
        </div>
      )}

      {mostFollowers && (
        <div className="bg-offwhite dark:bg-dark1 rounded-lg px-3 py-2 mt-6">
          <h2 className="font-extrabold mb-6 text-xl dark:text-whitish">
            Who to Follow
          </h2>
          {mostFollowers.map((item, index) => (
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
                  {item.followers} followers
                </p>
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
    </>
  );
}
