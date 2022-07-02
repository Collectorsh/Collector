import Activity from "/components/home/feed/Activity";
import Following from "/components/home/feed/Following";
import Auctions from "/components/home/feed/Auctions";
import AllListings from "/components/home/feed/AllListings";
import Galleries from "/components/home/feed/Galleries";
import RightColumn from "/components/home/RightColumn";

export default function Feed({ feed }) {
  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 px-4 min-h-screen relative">
        <div id="feed" className="col-span-1 md:col-span-3">
          {(feed === "activity" || !feed) && <Activity />}
          {feed === "following" && <Following />}
          {feed === "auctions" && <Auctions />}
          {feed === "listings" && <AllListings />}
          {feed === "galleries" && <Galleries />}
        </div>
        {feed !== "auctions" && (
          <div className="hidden md:block col-span-2 col-start-5">
            <RightColumn />
          </div>
        )}
      </div>
    </>
  );
}
