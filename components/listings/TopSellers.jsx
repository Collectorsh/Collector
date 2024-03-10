import Link from "next/link";
import Slider from "react-slick";
import Image from "/components/Image";
import { roundToTwo } from "/utils/roundToTwo";

export default function TopSellers({ listings }) {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="px-4 xl:px-0 mx-auto clear-both mt-20">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="tracking-wide text-center mt-10 mb-7 text-2xl font-bold text-neutral-800 w-full py-1 inline-block dark:text-whitish">
            Most Followed Collectors
          </h2>
        </div>
      </div>
      <div>
        <Slider {...settings}>
          {listings.map((item, index) => (
            <div key={index} className="px-4">
              <Link href={`/art/${item.listing.mintAddress}`}>
                <a>
                  <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl border border-neutral-200 dark:border-dark3">
                    <div className="pb-4" key={item.listing.mintAddress}>
                      <Image token={item.listing} />

                      <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 px-2">
                        {item.listing.name}
                      </div>
                      <div className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mt-2 px-2">
                        {item.name}
                      </div>
                      <div className="clear-both font-semibold text-neutral-700 dark:text-neutral-300 mt-2 px-2 border-t border-neutral-100 dark:border-dark1">
                        {item.listing.username && (
                          <div className="mt-2">
                            {item.listing.twitter_profile_image ? (
                              <img
                                src={item.listing.twitter_profile_image}
                                className="w-6 h-6 mr-1 rounded-full float-left mb-4"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full float-left mb-4 bg-whitish dark:bg-dark3" />
                            )}
                            <div className="ml-7 font-normal text-sm">
                              @{item.listing.username}
                            </div>
                          </div>
                        )}
                        <span className="block mt-4">
                          ◎{" "}
                          {roundToTwo(
                            item.listing.listings[0].price / 1000000000
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
