import Link from "next/link";

export default function MetaContainer({ user, token }) {
  return (
    <div>
      {user && (
        <>
          {user.names && (
            <h4 className="text-lg font-bold mt-1 left">{token.name}</h4>
          )}
          {user.show_artist_name && token.artist_name && (
            <div className="">
              {token.artist_name && (
                <>
                  <p className="font-semibold text-xs left">
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

          {user.description && (
            <p className="text-sm clear-both break-words mt-2">
              {token.description}
            </p>
          )}
        </>
      )}
    </div>
  );
}
