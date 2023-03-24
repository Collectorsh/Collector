import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/outline";

export default function Meta({ token, collector, market }) {
  const removeElement = (e) => {
    e.target.parentNode.remove();
  };

  return (
    <div className="mt-8">
      {(token.artist_name || token.artist_twitter) && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-black dark:text-white text-xl mb-3">Artist</p>
            <div className="mb-4">
              {token.artist_name && !token.artist_twitter && (
                <p className="text-black dark:text-white font-semibold inline">
                  <span className="font-semibold">{token.artist_name}</span>
                </p>
              )}
              {token.artist_twitter && (
                <>
                  {token.artist_twitter_image && (
                    <div>
                      <img
                        src={token.artist_twitter_image}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => removeElement(e)}
                      />
                    </div>
                  )}
                  <Link
                    href={`https://twitter.com/${token.artist_twitter}`}
                    title={token.artist_twitter}
                  >
                    <a>
                      <p className="text-black dark:text-white font-semibold inline align-middle">
                        {token.artist_twitter}
                      </p>
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-black dark:text-white text-xl mb-3">Collector</p>
            {collector &&
            collector.twitter_screen_name &&
            collector.twitter_profile_image ? (
              <>
                <div>
                  <img
                    src={collector.twitter_profile_image}
                    className="w-8 h-8 mr-1.5 rounded-full float-left"
                    onError={(e) => removeElement(e)}
                  />
                </div>

                <Link
                  href={`https://twitter.com/${collector.twitter_screen_name}`}
                  title={collector.twitter_screen_name}
                >
                  <a>
                    <p className="text-black dark:text-white font-semibold inline align-middle">
                      {collector.twitter_screen_name}
                    </p>
                  </a>
                </Link>
              </>
            ) : (
              <>
                {collector && collector.username ? (
                  <p className="font-bold dark:text-white">
                    <Link href={`/${collector.username}/profile`}>
                      <a>@{collector.username}</a>
                    </Link>
                  </p>
                ) : (
                  <p className="inline font-bold dark:text-white">???</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {market && (
        <p className="mt-3 text-normal tracking-wide font-semibold text-neutral-800 dark:text-neutral-100 hover:underline">
          <Link href={`/drops/${market}/market`}>
            <a>Go to original drop</a>
          </Link>
          <ArrowRightIcon
            className="h-4 w-4 ml-1 inline cursor-pointer"
            aria-hidden="true"
          />
        </p>
      )}
    </div>
  );
}
