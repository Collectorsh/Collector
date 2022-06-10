import Link from "next/link";
import {
  shadow,
  descriptionRounded,
  descriptionPadding,
} from "/utils/layoutOptions";

export default function NameAndDescription({ user, token }) {
  if (user && !user.names && !user.description) return null;

  return (
    <div
      className="bg-white p-2 dark:bg-dark2 px-3"
      style={{
        boxShadow: shadow(user),
        borderRadius: descriptionRounded(user),
      }}
    >
      {(!user || user.show_artist_name) && (
        <>
          {token.artist_name && (
            <div className="mb-4">
              {token.artist_name && (
                <p className="font-normal text-sm mb-2 left text-dark1 dark:text-gray-400 float-left">
                  Artist: {token.artist_name}
                </p>
              )}
              {token.artist_twitter && (
                <p className="font-normal text-sm mb-2 left text-dark1 dark:text-gray-400 hover:text-dark3 hover:dark:text-gray-100 hover:font-bold float-right">
                  <Link
                    href={`https://twitter.com/${token.artist_twitter.substring(
                      1
                    )}`}
                  >
                    <a target="_blank">{token.artist_twitter}</a>
                  </Link>
                </p>
              )}
            </div>
          )}
          <div className="clear-both"></div>
        </>
      )}

      {(!user || user.names) && (
        <h4 className="text-lg mt-1 mb-2 left text-dark1 dark:text-gray-200">
          {token.name}
        </h4>
      )}

      {(!user || user.description) && (
        <p
          className="text-sm clear-both text-dark3 dark:text-gray-300 break-words"
          style={{ paddingBottom: descriptionPadding(user) }}
        >
          {token.description}
        </p>
      )}
    </div>
  );
}
