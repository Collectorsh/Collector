import MainNavigation from "/components/navigation/MainNavigation";
import CheckLoggedIn from "/components/CheckLoggedIn";
import Store from "/components/store/Store";

export default function StoreHome() {
  return (
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <div className="px-4 xl:px-0 mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="mt-8 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
              Store
            </h2>
            <p className="mb-16 dark:text-whitish">
              Collect exclusive merch from top artists
            </p>
            <div className="w-full pb-3">
              <Store />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
