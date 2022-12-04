import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";
import { CheckIcon } from "@heroicons/react/solid";

export default function Premium() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="max-w-5xl mx-auto">
        <div className="px-4 xl:px-0">
          <h2 className="text-4xl text-center w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
            Collector Premium
          </h2>
          <section className="grid grid-cols-1 gap-x-20 lg:grid-cols-2 justify-items-center w-full w-full lg:px-10 py-12">
            <article className="w-full xl:w-[350px] bg-white w-full mb-10 lg:px-4 px-6 py-5 text-left text-primary-dark rounded-lg dark:bg-dark3 dark:text-gray-100 h-fit">
              <h5 className="font-bold text-2xl mb-3">Free</h5>
              <ul className="text-sm font-bold">
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Claim Username
                </li>
                <li className="pt-3 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Curate Gallery
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Browse the Activity Feed
                </li>
              </ul>
            </article>
            <article className="w-full xl:w-[350px] mb-10 px-6 py-8 lg:-mt-6 text-white text-left rounded-lg bg-burpledark h-fit">
              <h5 className="font-bold text-2xl mb-3">Premium</h5>
              <ul className="text-sm font-bold">
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Claim Username
                </li>
                <li className="pt-3 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Curate Gallery
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Browse the Activity Feed
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Follow your favorite artists
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Custom notifications
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Bid tracking
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Search Buy Now and live Auctions
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  More soon
                </li>
              </ul>
              <br />
              <Link href="/mint">
                <a className="px-4 py-3 text-xl text-center rounded-lg font-bold bg-greeny text-black mx-auto w-full">
                  Get Premium
                </a>
              </Link>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
