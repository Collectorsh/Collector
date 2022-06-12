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

function Nft({ image, token }) {
  const [activities, setActivities] = useContext(ActivitiesContext);
  const [singleNft, setSingleNft] = useContext(SingleNftContext);

  /////////////////////////////////////////////////////////////////////////////////////

  // Query to get single NFT
  const [getNftQl] = useLazyQuery(getNftQuery, {
    fetchPolicy: "network-only",
  });

  const fetchNft = useCallback(async () => {
    const res = await getNftQl({
      variables: { address: token.address },
    });
    setSingleNft(res.data.nft);
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchNft();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  // Query to get activities by auctionhouse
  const [getActivitiesQl] = useLazyQuery(getActivitiesQuery, {
    fetchPolicy: "network-only",
  });

  const fetchActivities = useCallback(async () => {
    const res = await getActivitiesQl({
      variables: { auctionhouse: process.env.NEXT_PUBLIC_AUCTIONHOUSE },
    });
    let activs = res.data.activities.filter(
      (a) => a.nft.mintAddress === token.mint
    );
    setActivities([...activities, ...activs]);
  }, []);

  // Run once on page load
  useEffect(() => {
    fetchActivities();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  // Refetch function to update NFT and Activities
  const refetch = async () => {
    fetchNft();
    fetchActivities();
  };

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

      <div className="mx-auto px-2 md:px-4 lg:px-12">
        <div className="mx-auto pb-4 px-2 md:px-0 -mt-4">
          <Single token={token} refetch={refetch} />
        </div>
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
