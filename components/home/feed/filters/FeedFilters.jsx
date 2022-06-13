export default function FeedFilters({ updateSelected, feedsSelected }) {
  function style(type) {
    let selected = feedsSelected.includes(type);
    let styles;
    if (selected) {
      styles =
        "bg-black text-white border-black dark:bg-whitish dark:text-black dark:border-whitish";
    } else {
      styles = "dark:text-whitish";
    }
    styles +=
      " cursor-pointer rounded-3xl mr-2 text-sm xl:text-md py-1 px-1 xl:py-1.5 xl:px-2.5 font-bold border border-4";
    return styles;
  }

  return (
    <>
      <h2 className="text-lg uppercase font-bold mb-2 dark:text-whitish">
        Filters
      </h2>
      <div className="mb-12">
        <button className={style("bid")} onClick={() => updateSelected("bid")}>
          New Bids
        </button>
        <button className={style("won")} onClick={() => updateSelected("won")}>
          Auctions Won
        </button>
        <button
          className={style("sale")}
          onClick={() => updateSelected("sale")}
        >
          Sales
        </button>
        <button
          className={style("listing")}
          onClick={() => updateSelected("listing")}
        >
          Listings
        </button>
      </div>
    </>
  );
}
