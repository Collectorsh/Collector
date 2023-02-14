import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import getMetadataFromMint from "/data/nft/getMetadataFromMint";
import Image from "/components/Image";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";

export default function Nft({ mint }) {
  const [token, setToken] = useState();
  const [artist, setArtist] = useState();
  const [twitter, setTwitter] = useState();

  const fetchNft = useCallback(async (mint) => {
    const res = await getMetadataFromMint(mint);
    setToken(res);
  }, []);

  useEffect(() => {
    fetchNft(mint.mint);
  }, []);

  useEffect(() => {
    if (!token) return;

    if (token.attributes && token.attributes.length) {
      setArtist(token.attributes[0].value);
    }

    if (mint.twitter) {
      setTwitter(mint.twitter);
    }
  }, [token]);

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
              <div className="h-fit my-1">
                <h3 className="text-md text-black dark:text-whitish font-medium">
                  {token.name}
                </h3>
                {twitter ? (
                  <p className="dark:text-whitish text-sm mb-2">
                    {twitter && (
                      <Link href={`https://twitter.com/${twitter}`}>
                        <a>
                          <span className="align-middle">{artist}</span>
                          <svg
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            className="h-3 w-3 fill-blue-300 inline ml-1 align-middle"
                          >
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
                          </svg>
                        </a>
                      </Link>
                    )}
                  </p>
                ) : (
                  <p className="dark:text-whitish text-sm">{artist}</p>
                )}
                {mint.listed && (
                  <div className="float-right mb-2">
                    <MarketplaceLogo source={mint.source} />{" "}
                    <span className="font-bold text-sm">
                      ◎{roundToTwo(mint.amount / 1000000000)}
                    </span>
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
