import Link from "next/link";
import NotFound from "../404";

export default function Tools() {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
      <div className="col-span-1">
        <div className="sticky top-4">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Collector Tools
          </h1>
          <p className="text-neutral-800 dark:text-neutral-100">
            Connecting Collectors, Artists &amp; Curators
          </p>
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-gallery_background dark:bg-dark1 rounded-3xl p-6">
          <div className="align-middle">
            {/* <PhotographIcon className="h-6 w-6 inline mr-1 align-middle text-white" /> */}
            <h2 className="text-white text-xl font-semibold inline align-middle">
              Gallery
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <div className="mt-8">
              <p className="text-white text-sm font-bold">
                Drag &amp; Drop to curate
              </p>
              <div className="bg-white p-2 rounded-xl mt-3">
                <img src="/images/gallery1.png" />
              </div>
            </div>
            <div className="mt-8">
              <p className="text-white text-sm font-bold">
                Share with the world
              </p>
              <div className="bg-white p-2 rounded-xl mt-3">
                <img src="/images/gallery2.png" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-8 bg-gray-200 dark:bg-dark2 rounded-3xl px-6 pt-6">
          <div className="align-middle">
            <CollectionIcon className="h-6 w-6 inline mr-1 align-middle" />
            <h2 className="text-black dark:text-white text-xl font-semibold inline align-middle">
              Feed
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 pb-0">
            <div className="mt-8 col-span-1">
              <div className="text-black dark:text-white">
                <div className="font-semibold">
                  See what other Collectors are
                </div>
                <div className="mt-4 inline md:block mr-1">Buying</div>
                <div className="mt-1 inline md:block mr-1">Selling</div>
                &amp;
                <div className="mt-1 inline md:block ml-1 md:ml-0">
                  Bidding on
                </div>
              </div>
              <div className="mt-8 block">
                <Link href="/feed">
                  <a className="py-3.5 px-4 text-lg rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold">
                    See More
                  </a>
                </Link>
              </div>
            </div>
            <div className="mt-4 md:-mt-12 col-span-1 md:col-span-2">
              <img src="/images/feed.png" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
