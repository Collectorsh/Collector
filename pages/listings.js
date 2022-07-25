import React, { useState, useCallback, useEffect } from "react";
import MainNavigation from "/components/navigation/MainNavigation";
import { useLazyQuery } from "@apollo/client";
import { getAllListingsQuery } from "/queries/all_listings";
import getListingCategories from "/data/listings/getListingCategories";
import TopArtists from "/components/listings/TopArtists";
import TopSellers from "/components/listings/TopSellers";
import Recent from "/components/listings/Recent";

const _ = require("lodash");

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [topSellers, setTopSellers] = useState();
  const [topArtists, setTopArtists] = useState();

  const changeSelected = (sel) => {
    setSelected(sel);
  };

  const [getListingsQl, { loading, error, data }] =
    useLazyQuery(getAllListingsQuery);

  const fetchListings = useCallback(async () => {
    const res = await getListingsQl({
      variables: {
        auctionHouses: process.env.NEXT_PUBLIC_AUCTIONHOUSE,
      },
    });

    // Set listings
    let listins = res.data.nfts.filter((l) => l.listings.length > 0);
    const results = await getListingCategories(listins);
    setListings([...listings, ...results.listings]);

    // Get top categories
    const sellers = results.sellers.sort((a, b) => b.followers - a.followers);
    setTopSellers(sellers);

    const artists = results.artists.sort((a, b) => b.sales - a.sales);
    setTopArtists(artists);
  }, []);

  useEffect(() => {
    fetchListings();
  }, []);

  const topArtistsListings = () => {
    const top = topArtists
      .slice(0, 10)
      .map((a) => ({ public_key: a.public_key, name: a.name }));
    const topList = top.map((t) => ({
      name: t.name,
      listing: listings.find((l) => l.creators[0].address === t.public_key),
    }));
    return topList;
  };

  const topSellersListings = () => {
    const top = topSellers
      .slice(0, 10)
      .map((a) => ({ public_key: a.public_key, name: a.name }));
    const topList = top.map((t) => ({
      name: t.name,
      listing: listings.find((l) => l.listings[0].seller === t.public_key),
    }));
    return topList;
  };

  const recentListings = () => {
    const sorted = listings
      .sort(
        (a, b) =>
          new Date(b.listings[0].createdAt) - new Date(a.listings[0].createdAt)
      )
      .slice(0, 9);
    return sorted;
  };

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto mb-10">
        <MainNavigation />
        {topArtists && listings && (
          <TopArtists listings={topArtistsListings()} />
        )}
        {topSellers && listings && (
          <TopSellers listings={topSellersListings()} />
        )}
        {listings && <Recent listings={recentListings()} />}
      </div>
    </div>
  );
}
