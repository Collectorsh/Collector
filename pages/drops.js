import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function Drops() {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white">
          <img
            src="/images/gacha.png"
            className="inline w-16 h-16 align-middle rounded-full"
          />
          <h2 className="sm:ml-4 align-middle sm:inline my-5 text-4xl font-bold text-gray-800 w-full py-1 inline-block">
            Collector Drops
          </h2>

          <p className="mt-4">
            Multiple artists, multiple editions, which one will you mint?
          </p>

          <p className="mt-4">
            Collector Drops is a fun way to mint art from artists that you know
            and some that you don&apos;t. All artists share equally in the sales
            and collectors can try their luck to see what they will get.
          </p>

          <h2 className="mt-8 pb-4 underline text-2xl font-bold text-gray-800">
            Upcoming
          </h2>

          <div className="grid grid-cols-3 sm:gap-2 mt-6">
            <div className="text-center">
              <p className="font-bold mb-1">Hana Knight</p>
              <Link href="/drops/hanaknight" title="Hana Knight">
                <a>
                  <div className="h-32 sm:h-44 md:h-52 lg:h-64 overflow-hidden">
                    <img src="/images/hanaknight.jpeg" />
                  </div>
                </a>
              </Link>
              <p className="text-sm mt-2">January 18th</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-1">Neverland</p>
              <div className="h-32 sm:h-44 md:h-52 lg:h-64 overflow-hidden">
                <img src="/images/neverland.jpeg" className="opacity-50" />
              </div>
              <p className="text-sm mt-2">January 25th</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-1">Rupture</p>
              <div className="h-32 sm:h-44 md:h-52 lg:h-64 overflow-hidden">
                <img src="/images/rupture.jpeg" className="opacity-50" />
              </div>
              <p className="text-sm mt-2">February 1st</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
