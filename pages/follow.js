import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import Artists from "/components/follow/Artists";

function Follow() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto relative">
        <MainNavigation />
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="tracking-wide text-center mt-14 mb-10 text-4xl font-bold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Follow Artists
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3"></div>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
              <Artists />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Follow;
