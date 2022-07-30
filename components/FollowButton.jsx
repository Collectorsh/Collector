import React, { useContext } from "react";
import UserContext from "/contexts/user";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import unfollowFollowUser from "/data/user/unfollowFollowUser";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/solid";

export default function FollowButton({ follow }) {
  const [user, setUser] = useContext(UserContext);

  const followUser = async (user_id, action) => {
    let res = await unfollowFollowUser(user.api_key, user_id, action);
    setUser(res.data.user);
  };

  return (
    <>
      {user &&
        (follow.id || follow.user_id) &&
        user.id !== follow.id &&
        user.id !== follow.user_id && (
          <>
            {user.following &&
            user.following.find(
              (f) => f.id === follow.id || f.id === follow.user_id
            ) ? (
              <Tippy
                content={`Stop following ${follow.username}`}
                className="bg-gray-300"
              >
                <MinusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-gray-400 dark:text-[#555] hover:text-red-600 dark:hover:text-red-600"
                  aria-hidden="true"
                  onClick={() =>
                    followUser(follow.id || follow.user_id, "unfollow")
                  }
                />
              </Tippy>
            ) : (
              <Tippy
                content={`Follow ${follow.username}`}
                className="bg-gray-300"
              >
                <PlusCircleIcon
                  className="h-8 w-8 cursor-pointer outline-none text-greeny hover:text-black dark:hover:text-white"
                  aria-hidden="true"
                  onClick={() =>
                    followUser(follow.id || follow.user_id, "follow")
                  }
                />
              </Tippy>
            )}
          </>
        )}
    </>
  );
}
