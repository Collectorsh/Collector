import React, { useContext } from "react";
import Link from "next/link";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import Image from "/components/Image";
import CollectorUsername from "/components/CollectorUsername";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";
import UserContext from "/contexts/user";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

export default function Details({ item }) {
  const [user, setUser] = useContext(UserContext);

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  return (
    <div className="mb-12">
      <div className="float-left w-11/12">
        {item.twitter_profile_image && (
          <img
            src={item.twitter_profile_image}
            className="w-12 h-12 mr-2 rounded-full float-left mb-4"
          />
        )}

        <div className="mb-0">
          {item.username && (
            <p className="inline mr-2">
              <CollectorUsername username={item.username} />
            </p>
          )}

          <p className="text-xs inline text-gray-400 dark:text-whitish clear-both">
            <Moment date={item.time} unix fromNow /> on {item.attributes.source}
          </p>
        </div>

        {item.type === "won" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Won{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.brand_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            by {item.attributes.brand_name} for ◎
            {roundToTwo(item.attributes.highest_bid / 1000000000)}
          </p>
        )}

        {item.type === "sale" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Purchased{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            {item.attributes.artist_name && (
              <>by {item.attributes.artist_name} </>
            )}
            for ◎{roundToTwo(item.attributes.amount / 1000000000)}
          </p>
        )}

        {item.type === "listing" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Listed{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.artist_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>
            {item.attributes.artist_name && (
              <> by {item.attributes.artist_name}</>
            )}
            {item.attributes.amount && (
              <> for ◎{roundToTwo(item.attributes.amount / 1000000000)}</>
            )}
          </p>
        )}

        {item.type === "bid" && (
          <p className="text-sm dark:text-whitish overflow-hidden mb-3">
            Placed a bid for ◎{roundToTwo(item.amount / 1000000000)} on{" "}
            <Link
              href={marketplaceLink(
                item.attributes.source,
                item.attributes.mint,
                item.attributes.brand_name,
                item.attributes.highest_bidder_username
              )}
            >
              <a className="hover:underline">{item.attributes.name}</a>
            </Link>{" "}
            by {item.attributes.brand_name}
          </p>
        )}
      </div>

      <div className="float-right mt-2">
        {user && item.user_id && user.id !== item.user_id && (
          <>
            {user.following &&
            user.following.find((f) => f.id === item.user_id) ? (
              <Tippy
                content={`Stop following ${item.username}`}
                className="bg-gray-300"
              >
                <MinusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-red-600 dark:hover:text-red-600"
                  aria-hidden="true"
                  onClick={() => followUser(item.user_id, "unfollow")}
                />
              </Tippy>
            ) : (
              <Tippy
                content={`Follow ${item.username}`}
                className="bg-gray-300"
              >
                <PlusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-greeny hover:text-black dark:hover:text-white"
                  aria-hidden="true"
                  onClick={() => followUser(item.user_id, "follow")}
                />
              </Tippy>
            )}
          </>
        )}
      </div>

      <div className="clear-both"></div>

      <Link
        href={marketplaceLink(
          item.attributes.source,
          item.attributes.mint,
          item.attributes.brand_name,
          item.attributes.highest_bidder_username
        )}
      >
        <a>
          <Image token={item.attributes} size="small" />
        </a>
      </Link>
    </div>
  );
}
