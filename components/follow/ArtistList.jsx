import React, { useState, useContext } from "react";
import updateFollowing from "/data/artists/updateFollowing";
import unfollowArtist from "/data/artists/unfollowArtist";
import FollowFilter from "/components/follow/ArtistFilter";
import UserContext from "/contexts/user";
import FollowingContext from "/contexts/following";
import NotFound from "../404";

export default function ArtistList() {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  const [user] = useContext(UserContext);
  const [following, setFollowing] = useContext(FollowingContext);
  const [followedArtists, setFollowedArtists] = useState(following);

  const changeStartNotify = async (artist, state) => {
    const res = await updateFollowing(
      user.api_key,
      artist,
      state,
      "notify_start"
    );
    setFollowing(res.following);
  };

  const changeListingNotify = async (artist, state) => {
    const res = await updateFollowing(
      user.api_key,
      artist,
      state,
      "notify_listing"
    );
    setFollowing(res.following);
  };

  const changeEditionNotify = async (artist, state) => {
    const res = await updateFollowing(
      user.api_key,
      artist,
      state,
      "notify_edition"
    );
    setFollowing(res.following);
  };

  const changeEndNotify = async (artist, state) => {
    const res = await updateFollowing(
      user.api_key,
      artist,
      state,
      "notify_end"
    );
    setFollowing(res.following);
  };

  const changeUnfollow = async (artist) => {
    const res = await unfollowArtist(user.api_key, artist);
    setFollowing(res.following);
  };

  function filteredResults(results) {
    setFollowedArtists(results);
  }

  return (
    <div className="dark:text-neutral-200 leading-6 pb-6">
      <FollowFilter following={following} filteredResults={filteredResults} />
      {following && following.length > 0 ? (
        <>
          <table className="relative h-full min-w-full rounded-lg border-neutral-100 dark:border-neutral-900 border-0 border-separate [border-spacing:0_0.5rem]">
            <thead className="top-[9rem] bg-white dark:bg-dark2">
              <tr>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  Artist
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  Buy Now Listing
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  New Edition
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  Auction Start
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  Auction End
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-neutral-600 dark:text-neutral-400 ng-star-inserted"
                >
                  Unfollow
                </th>
              </tr>
            </thead>
            <tbody>
              {followedArtists.map((follow, index) => (
                <tr
                  key={index}
                  className="bg-transparent dark:bg-dark3 dark:border-0 dark:text-neutral-50 h-full lg:hover:shadow-[0_12px_40px_0px_rgba(0,0,0,0.18)] rounded-xl shadow-[0_12px_40px_0px_rgba(0,0,0,0.06)] text-neutral-900 ng-star-inserted"
                >
                  <td className="py-4 px-6">{follow.artist}</td>
                  <td className="py-4 px-6 text-center">
                    Bell
                    {/* <BellIcon
                      className={`inline h-5 w-5 align-middle cursor-pointer ${
                        follow.notify_listing
                          ? "text-green-600"
                          : "text-neutral-400"
                      }`}
                      onClick={(e) =>
                        changeListingNotify(
                          follow.artist,
                          follow.notify_listing ? false : true
                        )
                      }
                    /> */}
                  </td>
                  <td className="py-4 px-6 text-center">
                    Bell
                    {/* <BellIcon
                      className={`inline h-5 w-5 align-middle cursor-pointer ${
                        follow.notify_edition
                          ? "text-green-600"
                          : "text-neutral-400"
                      }`}
                      onClick={(e) =>
                        changeEditionNotify(
                          follow.artist,
                          follow.notify_edition ? false : true
                        )
                      }
                    /> */}
                  </td>
                  <td className="py-4 px-6 text-center">
                    Bell
                    {/* <BellIcon
                      className={`inline h-5 w-5 align-middle cursor-pointer ${
                        follow.notify_start ? "text-green-600" : "text-neutral-400"
                      }`}
                      onClick={(e) =>
                        changeStartNotify(
                          follow.artist,
                          follow.notify_start ? false : true
                        )
                      }
                    /> */}
                  </td>
                  <td className="py-4 px-6 text-center">
                    Bell
                    {/* <BellIcon
                      className={`inline h-5 w-5 align-middle cursor-pointer ${
                        follow.notify_end ? "text-green-600" : "text-neutral-400"
                      }`}
                      onClick={(e) =>
                        changeEndNotify(
                          follow.artist,
                          follow.notify_end ? false : true
                        )
                      }
                    /> */}
                  </td>
                  <td className="py-4 px-6 text-center">
                    Trash
                    {/* <TrashIcon
                      className="inline h-5 w-5 align-middle cursor-pointer text-red-700"
                      onClick={(e) => changeUnfollow(follow.artist)}
                    /> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <p className="my-4 w-full lg:w-1/2">
            You&apos;re not following anyone yet. Use the search above to find
            great artists to follow.
          </p>
        </>
      )}
    </div>
  );
}
