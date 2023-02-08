import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function Drops() {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
          <img src="/images/drop.png" className="inline h-10 align-middle" />
          <h2 className="sm:ml-3 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
            Drops by Collector
          </h2>

          <p className="mt-4">Solo and group drops from top artists.</p>

          <p className="mt-4">
            Each drop is shaped by the artists and can include any number of
            1/1s and editions. Collectors randomly receive any piece from the
            drop when they mint.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-8">
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Hana Knight</p>
              <Link href="/drops/hanaknight" title="Hana Knight Drop">
                <a>
                  <img
                    src="/images/hanaknight.jpeg"
                    className="w-full h-96 lg:h-64 object-center object-cover"
                  />
                </a>
              </Link>
              <p className="text-sm mt-2">January 18th</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Neverland</p>
              <Link href="/drops/neverland" title="PAUSE">
                <a>
                  <img
                    src="/images/neverland.jpeg"
                    className="w-full h-96 lg:h-64 object-center object-cover"
                  />
                </a>
              </Link>
              <p className="text-sm mt-2">January 26th</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Zero Monke Biz</p>
              <Link href="/drops/zmb" title="Zero Monke Biz">
                <a>
                  <img
                    src="/images/zmb1.jpeg"
                    className="w-full h-96 lg:h-64 object-center object-cover"
                  />
                </a>
              </Link>
              <p className="text-sm mt-2">Febraury 3rd</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Rupture</p>
              <Link href="/drops/rupture" title="Monochromatic Dreams">
                <a>
                  <img
                    src="/images/rupture.jpeg"
                    className="w-full h-96 lg:h-64 object-center object-cover"
                  />
                </a>
              </Link>
              <p className="text-sm mt-2">February 6th</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Bonk</p>
              <img
                src="/images/bonk.jpeg"
                className="w-full h-96 lg:h-64 object-center object-cover"
              />
              <p className="text-sm mt-2">February 8th</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">21dao</p>
              <img
                src="/images/21.jpeg"
                className="w-full h-96 lg:h-64 object-center object-cover"
              />
              <p className="text-sm mt-2">February 22nd</p>
            </div>
            <div className="text-center mb-6">
              <p className="font-bold mb-1">Rick Bakas</p>
              <img
                src="/images/rickbakas.jpeg"
                className="w-full h-96 lg:h-64 object-center object-cover"
              />
              <p className="text-sm mt-2">March 1st</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
