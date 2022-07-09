export default function FeedMenu({ feed, updateFeed }) {
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
      " cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1.5 px-1.5 xl:py-1.5 xl:px-2.5 font-bold border border-4";
    return styles;
  }

  return (
    <>
      <ul className="text-sm py-4">
        <li className="inline-block">
          <a
            className={style("activity")}
            onClick={() => updateFeed("activity")}
          >
            <span className="">Activity</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("following")}
            onClick={() => updateFeed("following")}
          >
            <span className="">Following</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("auctions")}
            onClick={() => updateFeed("auctions")}
          >
            <span className="">Auctions</span>
          </a>
        </li>
        <li className="inline-block">
          <a
            className={style("galleries")}
            onClick={() => updateFeed("galleries")}
          >
            <span className="">Galleries</span>
          </a>
        </li>
      </ul>
    </>
  );
}
