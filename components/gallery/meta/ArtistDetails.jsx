import Link from "next/link";

export default function ArtistDetails({ token }) {
  return (
    <>
      {token.artist_name && (
        <div className="">
          {token.artist_name && (
            <>
              <p className="font-semibold text-xs left text-dark1 dark:text-neutral-400">
                {token.artist_twitter && (
                  <Link
                    href={`https://twitter.com/${token.artist_twitter.substring(
                      1
                    )}`}
                  >
                    <a
                      className="cursor-pointer hover:underline"
                      target="_blank"
                    >
                      {token.artist_twitter}
                    </a>
                  </Link>
                )}
                {!token.artist_twitter && token.artist_name && (
                  <span>{token.artist_name}</span>
                )}
              </p>
            </>
          )}
        </div>
      )}
      <div className="clear-both"></div>
    </>
  );
}
