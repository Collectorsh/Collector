import Link from "next/link";
import { cdnImage } from "/utils/cdnImage";

export default function GalleryContent({ name, items }) {
  function addDefaultSource(e, url) {
    if (!url) return;
    e.target.src = url;
  }

  return (
    <div
      id="feed"
      className="mt-12 clear-both xl:mt-24 mb-12 bg-gray-50 dark:bg-dark1 p-4 rounded-lg mx-4 xl:mx-0"
    >
      <h2 className="text-xl font-bold text-black dark:text-whitish mb-6 text-gray-800 ml-2">
        {name}
      </h2>
      <div className="items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3 pb-2"
          >
            <div className="rounded-lg overflow-hidden">
              <Link href={`/${item.username}`}>
                <a>
                  <img
                    src={cdnImage(item.mint)}
                    onError={(e) => addDefaultSource(e, item.image)}
                  />
                </a>
              </Link>
            </div>
            <div className="mt-2">
              <Link href={`/${item.username}`}>
                <a>
                  {item.twitter_profile_image && (
                    <img
                      src={item.twitter_profile_image}
                      className="w-8 h-8 mr-1.5 rounded-full float-left"
                    />
                  )}

                  <div className="mt-2">
                    {item.username && (
                      <p className="inline font-bold leading-7 dark:text-white">
                        @{item.username}
                      </p>
                    )}
                  </div>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
