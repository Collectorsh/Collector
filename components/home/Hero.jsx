import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { scrollToFeed } from "/utils/scrollToFeed";
import getLiveAuctions from "/data/home/getLiveAuctions";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import Moment from "react-moment";

export default function Hero() {
  const [auctions, setAuctions] = useState();

  const fetchLiveAuctions = useCallback(async () => {
    let res = await getLiveAuctions();
    setAuctions(res.data);
  }, []);

  useEffect(() => {
    fetchLiveAuctions();
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <div className="mx-auto px-4 xl:px-0 pb-0 lg:pb-4 bg-white dark:bg-black mt-8">
        <div className="mx-auto md:px-0">
          <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 mb-8 lg:mb-0 items-center">
            <div className="col-span-4 align-middle xl:mr-20 lg:mt-12">
              <h1 className="font-bold tracking-wide text-black dark:text-whitish text-center">
                <p className="text-5xl">Discover</p>
                <p className="mt-4 text-5xl">&amp;</p>
                <p className="mt-4 text-5xl">Share</p>
                <p className="mt-6 text-5xl">Beautiful Art</p>
              </h1>

              <div className="my-16 text-center">
                <a
                  className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer"
                  onClick={scrollToFeed}
                >
                  View Feed{" "}
                  <ChevronDownIcon
                    className="h-6 w-6 inline -mt-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
            <div className="lg:gap-y-8 col-end-8 col-span-3 relative">
              {auctions && (
                <Slider {...settings}>
                  {auctions.map((item, index) => (
                    <>
                      <div
                        key={index}
                        className="overflow-hidden col-span-2 relative -mt-2"
                      >
                        <Link
                          href={marketplaceLink(
                            item.source,
                            item.mint,
                            item.artist_name
                          )}
                        >
                          <a>
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                            />
                          </a>
                        </Link>
                        <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-4 left-2 cursor-pointer">
                          <Link href={`/${item.username}/profile`}>
                            <a>@{item.username}</a>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 text-center dark:text-white">
                        <h2>
                          <Link
                            href={marketplaceLink(
                              item.source,
                              item.mint,
                              item.artist_name
                            )}
                          >
                            <a>
                              {item.name} ◎
                              {roundToTwo(
                                (item.highest_bid || item.reserve) / 1000000000
                              )}{" "}
                              ends <Moment date={item.end_time} unix fromNow />
                              <br />
                              <MarketplaceLogo source={item.source} />
                            </a>
                          </Link>
                        </h2>
                      </div>
                    </>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
