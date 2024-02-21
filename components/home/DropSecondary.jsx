import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getDropSecondary from "/data/home/getDropSecondary";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import { roundToTwo } from "/utils/roundToTwo";
import ContentLoader from "react-content-loader";

export default function DropSecondary() {
  return; //DEPRECATED - TO BE DELETED
  const [listings, setListings] = useState();

  const fetchDropSecondary = useCallback(async () => {
    let res = await getDropSecondary();
    if (res) setListings(res.data.sort(() => 0.5 - Math.random()).slice(0, 20));
  }, []);

  useEffect(() => {
    fetchDropSecondary();
  }, []);

  const loadingImages = () => {
    var rows = [];
    for (var i = 0; i < 10; i++) {
      rows.push(
        <div
          key={i}
          className="overflow-hidden relative h-[375px] sm:h-[315px] w-[375px] sm:w-[315px] px-4"
        >
          <ContentLoader
            speed={2}
            className="w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl"
            backgroundColor="rgba(120,120,120,0.2)"
            foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full mb-4 h-[325px] sm:h-[250px] border border-neutral-300 dark:border-neutral-800 rounded-xl" />
          </ContentLoader>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="clear-both py-6">
      <h2 className="text-2xl font-semibold text-neutral-800 w-full inline-block dark:text-white">
        Drops Secondary
      </h2>
      <p className="font-semibold mb-2 hover:underline dark:text-white">
        <Link href="/drops">
          <a>See all Drops</a>
        </Link>
        {/* <ArrowRightIcon
          className="h-4 w-4 ml-1 inline cursor-pointer"
          aria-hidden="true"
        /> */}
        Right arrow
      </p>
      <div className="grid grid-flow-col grid-cols-card auto-cols-card py-4 gap-6 overflow-x-auto items-start mt-6">
        {listings ? (
          <>
            {listings.map((l, index) => (
              <div
                key={index}
                className="overflow-hidden relative h-[385px] sm:h-[315px] w-[375px] sm:w-[315px] px-4"
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
  );
}
