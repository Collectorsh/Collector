import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function About() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="max-w-3xl mx-auto">
        <div className="px-4 xl:px-0">
          <h2 className="text-2xl w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
            About Collector
          </h2>

          <p>
            We started Collector in April 2022 to make it easier to share,
            discover, and collect digital artwork on Solana.
          </p>
          <p className="mt-4">
            Beautiful artwork deserves to be shared. Our 2D gallery is the most
            popular way to display art collections on Solana. We're proud to
            offer this product completely free and open source.
          </p>
          <p className="mt-4">
            We believe that every artwork should get the visibility it deserves.
            The Solana art scene is highly fragmented across different platforms
            making it difficult to discover new artists and drops. Collector
            helps in two ways:
          </p>
          <ul className="mt-4">
            <li>
              On the free side, the Collector Activty feed makes it easy to see
              what every Collector user is buying, bidding on, or listing.
              Additionally, we offer premium tools for serious collectors. Learn
              more{" "}
              <Link href="/mint" title="Collector Premium">
                <a className="underline">here</a>
              </Link>
              .
            </li>
            <li className="mt-2">
              Next up: making it easy and fun to collect art on Solana. More
              soon.
            </li>
          </ul>
          <p className="mt-4">
            Please DM us on Twitter if we can help in any way. We also love to
            hear feedback so please don&apos;t be shy.
          </p>
          <p className="mt-4 font-semibold">- Richard & Nate</p>
        </div>
      </div>
    </div>
  );
}
