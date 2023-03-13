import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getDropSecondary from "/data/home/getDropSecondary";
import Slider from "react-slick";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";
import { ArrowRightIcon } from "@heroicons/react/outline";

export default function DropSecondary() {
  const [listings, setListings] = useState();

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const fetchDropSecondary = useCallback(async () => {
    let res = await getDropSecondary();
    setListings(res.data.sort(() => 0.5 - Math.random()).slice(0, 20));
  }, []);

  useEffect(() => {
    fetchDropSecondary();
  }, []);

  return (
    <div className="clear-both mx-4 xl:mx-0 py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-neutral-800 w-full inline-block dark:text-white">
          Drops Secondary
        </h2>
        <p className="font-semibold mb-2 hover:underline dark:text-white">
          <Link href="/drops">
            <a>See all Drops</a>
          </Link>
          <ArrowRightIcon
            className="h-4 w-4 ml-1 inline cursor-pointer"
            aria-hidden="true"
          />
        </p>
        <div className="mt-6"></div>
        {listings && (
          <>
            <Slider {...settings}>
              {listings.map((l, index) => (
                <div
                  key={index}
                  className="overflow-hidden col-span-2 relative h-[375px] sm:h-[315px] px-4"
                >
                  <Link href={marketplaceLink(l.source, l.mint)}>
                    <a>
                      <img
                        src={l.image}
                        alt=""
                        className="object-center object-cover w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl"
                      />
                    </a>
                  </Link>
                  <div className="mt-2 text-center dark:text-white font-semibold">
                    <Link href={marketplaceLink(l.source, l.mint)}>
                      <a>
                        <div className="w-full">{l.name}</div>
                        <div className="inline middle">
                          ◎{roundToTwo(l.amount / 1000000000)}
                        </div>
                        {/* <div className="inline ml-1 middle">
                          <MarketplaceLogo source={l.source} />
                        </div> */}
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
}
