export default function ArtistPageHeader({ user, tokens, stats }) {
  const token = tokens ? tokens[Math.floor(Math.random() * tokens.length)] : {};

  return (
    <div className="relative bg-black overflow-hidden">
      <div
        className="absolute -top-40 -left-20 -bottom-40 -right-20 opacity-40 object-center object-cover rotate-12"
        style={{
          backgroundImage: `url('https://cdn.collector.sh/${
            token && token.mint
          }')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="h-96 lg:h-80 relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        {user.twitter_profile_image ? (
          <img
            src={user.twitter_profile_image.replace("normal", "400x400")}
            className="w-24 h-24 sm:w-44 sm:h-44 object-center object-cover bg-white p-2 rounded-xl absolute top-4 sm:top-12"
          />
        ) : (
          <img
            src={`https://cdn.collector.sh/${token && token.mint}`}
            className="w-24 h-24 sm:w-44 sm:h-44 object-center object-cover bg-white p-2 rounded-xl absolute top-4 sm:top-12"
          />
        )}

        <div className="float-left mt-4 sm:mt-12 w-full">
          <div className="ml-28 sm:ml-48">
            <h1 className="text-3xl font-bold inline-block tracking-wider text-white">
              {user.name
                ? user.name
                : user.username.charAt(0).toUpperCase() +
                  user.username.slice(1)}
            </h1>
            <p className="text-white">{user.bio}</p>
          </div>
          {stats && (
            <div className="absolute bottom-0 left-4 right-4 sm:w-fit sm:left-auto sm:right-auto my-4 text-black text-bold bg-white bg-opacity-60 rounded-lg">
              <div className="grid grid-cols-3 py-1">
                <div
                  className="px-4 border-r"
                  style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                >
                  <div className="text-sm mb-1">Items</div>
                  <div className="text-lg">{stats.items}</div>
                </div>
                <div
                  className="px-4 border-r"
                  style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                >
                  <div className="text-sm mb-1">Collections</div>
                  <div className="text-lg">{stats.collections}</div>
                </div>
                <div
                  className="px-4 border-r"
                  style={{ borderColor: "rgba(255, 255, 255, .2)" }}
                >
                  <div className="text-sm mb-1">Listed</div>
                  <div className="text-lg">{stats.listings}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
