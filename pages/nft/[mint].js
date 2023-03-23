import React, { useEffect, useContext, useCallback, useState } from "react";
import Head from "next/head";
import MainNavigation from "/components/navigation/MainNavigation";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Single from "/components/single/Single";
import { cdnImage } from "/utils/cdnImage";
import { useLazyQuery } from "@apollo/client";
import { getNftQuery } from "/queries/single_nft";
import { getActivitiesQuery } from "/queries/activities";
import ActivitiesContext from "/contexts/activities";
import SingleNftContext from "/contexts/single_nft";
import { auctionHousesArray } from "/config/settings";
import findMarket from "/data/drops/findMarket";

function Nft({ image, token }) {
  const [activities, setActivities] = useContext(ActivitiesContext);
  const [, setSingleNft] = useContext(SingleNftContext);
  const auctionHouses = auctionHousesArray.map((a) => a.address);
  const [market, setMarket] = useState();

  /////////////////////////////////////////////////////////////////////////////////////

  // Query to get single NFT
  const [getNftQl] = useLazyQuery(getNftQuery, {
    fetchPolicy: "network-only",
  });

  const fetchNft = useCallback(async (token) => {
    const res = await getNftQl({
      variables: { address: token.address },
    });
    setSingleNft(res.data.nft || {});
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchNft(token);
  }, [token, fetchNft]);

  /////////////////////////////////////////////////////////////////////////////////////

  // Query to get activities by auctionhouse
  const [getActivitiesQl] = useLazyQuery(getActivitiesQuery, {
    fetchPolicy: "network-only",
  });

  const fetchActivities = useCallback(async () => {
    const res = await getActivitiesQl({
      variables: { auctionhouses: auctionHouses },
    });
    let activs = res.data.activities.filter(
      (a) => a.nft.mintAddress === token.mint
    );
    setActivities(
      activs.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
    );
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchActivities();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  // Refetch function to update NFT and Activities
  const refetch = async () => {
    fetchNft(token);
    fetchActivities();
  };

  /////////////////////////////////////////////////////////////////////////////////////

  // Find if mint belongs to a drop and has a marketplace
  const fetchMarketplace = useCallback(async () => {
    const res = await findMarket(token.mint);
    if (res.status === "success") setMarket(res.market);
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchMarketplace();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="dark:bg-black">
      <Head>
        {token && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={token.name} />
            <meta
              name="twitter:description"
              content={`View ${token.name} on Collector`}
            />
            <meta name="twitter:image" content={image} />
          </>
        )}
      </Head>

      <MainNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <Single token={token} market={market} refetch={refetch} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let mint = context.params.mint;
  let image = cdnImage(mint);
  let token = await getMetadataFromMint(mint);
  return { props: { image, token } };
}

export default Nft;
