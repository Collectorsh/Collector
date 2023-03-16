import Link from "next/link";
import Image from "/components/Image";
import { marketplaceLink } from "/utils/marketplaceHelpers";
import MarketplaceLogo from "/components/MarketplaceLogo";
import { roundToTwo } from "/utils/roundToTwo";

export default function Nft({ token }) {
  const link = token
    ? token.listed
      ? marketplaceLink(token.source, token.mint)
      : `/nft/${token.mint}`
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
                {token.listed && (
                  <div className="float-left my-2">
                    <MarketplaceLogo source={token.source} />{" "}
                    <span className="font-bold text-sm">
                      ◎{roundToTwo(token.amount / 1000000000)}
                    </span>
                  </div>
                )}
                {token.owned && (
                  <div className="float-right my-2">
                    <Link href={`/nft/${token.mint}`}>
                      <a className="bg-dark1 px-3 py-1 rounded text-white text-sm">
                        List
                      </a>
                    </Link>
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
