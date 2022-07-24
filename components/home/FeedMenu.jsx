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
      " hover:bg-black hover:text-white hover:border-black dark:hover:bg-whitish dark:hover:text-white dark:hover:border-whitish dark:hover:text-black cursor-pointer rounded-3xl text-sm xl:text-md py-1.5 px-1.5 xl:py-1.5 xl:px-2.5 font-bold border border-4";
    return styles;
  }

  return (
    <div className="flex text-sm my-4 justify-between sm:w-96">
      <div>
        <a className={style("activity")} onClick={() => updateFeed("activity")}>
          <span className="">Activity</span>
        </a>
      </div>
      <div>
        <a
          className={style("following")}
          onClick={() => updateFeed("following")}
        >
          <span className="">Following</span>
        </a>
      </div>
      <div>
        <a className={style("auctions")} onClick={() => updateFeed("auctions")}>
          <span className="">Auctions</span>
        </a>
      </div>
      <div>
        <a
          className={style("galleries")}
          onClick={() => updateFeed("galleries")}
        >
          <span className="">Galleries</span>
        </a>
      </div>
    </div>
  );
}
