import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { scrollToFeed } from "/utils/scrollToFeed";

export default function FeedMenu({ updateFeed }) {
  const router = useRouter();
  const [feed, setFeed] = useState("activity");

  const changeFeed = (feed) => {
    router.push(`/?feed=${feed}`, undefined, { shallow: true });
    setFeed(feed);
  };

  useEffect(() => {
    if (!router.query.feed) return;
    updateFeed(router.query.feed);
    scrollToFeed();
  }, [router.query.feed]);

  function style(type) {
    let selected = feed === type;
    let styles;
    if (selected) {
      styles =
        "bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish";
    } else {
      styles = "dark:text-whitish";
    }
    styles +=
      " cursor-pointer rounded-3xl ml-2 text-sm xl:text-md py-1.5 px-1.5 xl:py-1.5 xl:px-2.5 font-bold border border-4";
    return styles;
  }

  return (
    <>
      <ul className="text-sm sm:float-right mt-4 sm:mt-2 mb-4 sm:mb-0 text-center sm:text-right">
        <li className="inline-block">
          <a
            className={style("activity")}
            onClick={() => changeFeed("activity")}
          >
            <span className="">Activity</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("following")}
            onClick={() => changeFeed("following")}
          >
            <span className="">Following</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("auctions")}
            onClick={() => changeFeed("auctions")}
          >
            <span className="">Auctions</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("galleries")}
            onClick={() => changeFeed("galleries")}
          >
            <span className="">Galleries</span>
          </a>
        </li>
      </ul>
    </>
  );
}
