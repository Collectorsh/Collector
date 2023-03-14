import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function About() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="max-w-3xl mx-auto pb-12">
        <div className="px-4">
          <h2 className="text-2xl w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
            About Collector
          </h2>

          <p>
            We&apos;re Richard & Nate, the co-founders of Collector. Our passion
            for digital art inspired us to create a platform that makes it
            easier to share, discover, and collect beautiful digital artwork on
            Solana.
          </p>
          <p className="mt-4">
            Our 2D gallery is a popular way to showcase art collections and
            we&apos;re proud to offer it for free and open source. We believe
            every artwork deserves visibility and our goal is to bring the
            fragmented Solana art scene together in one place.
          </p>
          <p className="mt-4">
            We&apos;re also excited to announce our Drops feature, where artists
            can sell their work in new and creative ways, giving collectors
            unique experiences in buying art.
          </p>
          <p className="mt-4">
            Collector offers a free activity feed and advanced discovery tools
            to help you find the perfect artwork for your collection. Our
            mission is to make collecting digital art easy, enjoyable, and
            accessible to everyone.
          </p>
          <p className="mt-4">
            We&apos;re always here to help, so don&apos;t hesitate to reach out
            via Twitter. We appreciate your feedback and look forward to growing
            with the Solana art community.
          </p>
          <p className="mt-4 font-semibold">
            -{" "}
            <Link href="https://twitter.com/richjard" title="Twitter">
              <a className="text-[#1E9BF0]" target="_blank">
                Richard
              </a>
            </Link>{" "}
            &{" "}
            <Link href="https://twitter.com/n8solomon" title="Twitter">
              <a className="text-[#1E9BF0]" target="_blank">
                Nate
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
