import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Image from "/components/Image";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";

export default function Nft({ mint }) {
  const [token, setToken] = useState();

  const fetchNft = useCallback(async (mint) => {
    const res = await getMetadataFromMint(mint);
    setToken(res);
  }, []);

  useEffect(() => {
    fetchNft(mint.mint);
  }, []);

  const link = mint
    ? mint.listed
      ? marketplaceLink(mint.source, mint.mint)
      : `/nft/${mint.mint}`
    : null;

  return (
    <>
      {token && (
        <div className="relative bg-white dark:bg-dark3 shadow-lg sm:shadow-xl rounded-2xl pt-[10px] px-[10px] border border-gray-200 dark:border-dark3">
          <div className="rounded-lg overflow-hidden">
            <Link href={link}>
              <a>
                <Image token={token} />
              </a>
            </Link>
          </div>
          <div>
            <div className="w-full">
              <div className="h-12 my-1">
                <h3 className="text-md text-black dark:text-whitish font-medium">
                  {token.name}
                </h3>
                {token.attributes && token.attributes.length > 0 && (
                  <p className="dark:text-whitish text-xs">
                    {token.attributes[0].value}
                  </p>
                )}
                {mint.listed && (
                  <div className="float-right mb-2">
                    <MarketplaceLogo source={mint.source} color="white" /> ◎
                    {roundToTwo(mint.amount / 1000000000)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
