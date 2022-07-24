import Link from "next/link";
import ShareToTwitter from "/components/ShareToTwitter";
import { host } from "/config/settings";

export default function Meta({ token, collector }) {
  return (
    <div className="mt-8 rounded-lg bg-gray-50 dark:bg-dark1 border border-gray-200 dark:border-dark3 p-2">
      {(token.artist_name || token.artist_twitter) && (
        <div className="mb-4">
          <p className="text-black dark:text-white text-semibold inline mr-2 text-sm bg-gray-200 dark:bg-dark3 px-2 py-1 rounded">
            artist
          </p>
          {token.artist_name && (
            <p className="text-black dark:text-white text-semibold inline">
              <span className="font-semibold text-sm">{token.artist_name}</span>
            </p>
          )}
          {token.artist_name && token.artist_twitter && (
            <p className="text-black dark:text-white text-semibold inline mx-2 text-sm">
              {"//"}
            </p>
          )}
          {token.artist_twitter && (
            <>
              <Link
                href={`https://twitter.com/${token.artist_twitter}`}
                title={token.artist_twitter}
              >
                <a>
                  <p className="text-black dark:text-white text-semibold inline text-sm">
                    {token.artist_twitter}
                  </p>
                </a>
              </Link>
            </>
          )}
        </div>
      )}

      {collector && (
        <div className="mb-3">
          <p className="w-fit inline mt-4 dark:bg-dark3 text-black dark:text-white text-semibold bg-gray-200 mr-2 text-sm px-2 py-1 rounded">
            owner
          </p>
          <p className="inline text-sm dark:text-white">
            <Link href={`/${collector}/profile`}>
              <a>@{collector}</a>
            </Link>
          </p>
        </div>
      )}

      <p>
        <ShareToTwitter
          url={`${token.name} ${
            token.artist_twitter ? `by ${token.artist_twitter}` : ""
          }\n\n${host}/nft/${token.mint}`}
          size="18"
          text="Tweet It"
        />
      </p>
    </div>
  );
}
