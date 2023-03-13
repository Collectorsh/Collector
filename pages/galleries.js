import MainNavigation from "/components/navigation/MainNavigation";
import Galleries from "/components/galleries/Galleries";

export default function GalleriesHome() {
  return (
    <div>
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-white">
            Galleries
          </h2>
          <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3">
            <Galleries />
          </div>
        </div>
      </div>
    </div>
  );
}
