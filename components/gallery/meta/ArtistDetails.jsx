import Link from "next/link";

export default function ArtistDetails({ user, token }) {
  if (user && !user.show_artist_name) return null;

  return (
    <>
      {token.artist_name && (
        <div className="mb-4">
          {token.artist_name && (
            <p className="font-normal text-sm left text-dark1 dark:text-gray-400 float-left">
              {token.artist_name}
              {token.artist_twitter && (
                <>
                  <span> {"/"} </span>
                  <Link
                    href={`https://twitter.com/${token.artist_twitter.substring(
                      1
                    )}`}
                  >
                    <a target="_blank">{token.artist_twitter}</a>
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      )}
      <div className="clear-both"></div>
    </>
  );
}
