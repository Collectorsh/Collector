import Link from "next/link";
import { cdnImage } from "/utils/cdnImage";
import ContentLoader from "react-content-loader";

export default function GalleryContent({ name, items }) {
  function addDefaultSource(e, url) {
    if (!url) return;
    e.target.src = url;
  }

  const loadingImages = () => {
    var rows = [];
    for (var i = 0; i < 8; i++) {
      rows.push(
        <div className="overflow-hidden relative h-[375px] sm:h-[315px] w-[375px] sm:w-[315px] px-4">
          <ContentLoader
            speed={2}
            className="w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl"
            backgroundColor="#bbbbbb"
            foregroundColor="#aaaaaa"
          >
            <rect className="w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl" />
          </ContentLoader>
        </div>
      );
    }
    return rows;
  };

  return (
    <div
      id="feed"
      className="bg-gray-50 dark:bg-dark1 rounded-lg mt-6"
      style={{
        backgroundImage: `url(${
          items &&
          items.length > 0 &&
          items[Math.floor(Math.random() * (items.length - 1))].image
        })`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="p-4 rounded-lg overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 className="py-3 px-4 rounded-3xl bg-whitish text-black font-semibold cursor-pointer mb-3 ml-2 w-fit">
          {name}
        </h2>
        <div className="grid grid-flow-col grid-cols-card auto-cols-card py-4 gap-6 overflow-x-auto items-start">
          {items ? (
            <>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden relative h-[385px] sm:h-[315px] w-[375px] sm:w-[315px] px-4"
                >
                  <div className="rounded-lg overflow-hidden">
                    <Link href={`/${item.username}`}>
                      <a>
                        <img
                          src={cdnImage(item.mint)}
                          onError={(e) => addDefaultSource(e, item.image)}
                          className="object-center object-cover w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl"
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
                            <p className="inline font-bold leading-7 text-white">
                              @{item.username}
                            </p>
                          )}
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>{loadingImages()}</>
          )}
        </div>
      </div>
    </div>
  );
}
