import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NotFound from "../components/404";

export default function Faq() {
  return <NotFound />
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <h2 className="text-2xl w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
          Frequenty Asked Questions
        </h2>

        <h2 className="w-full pb-2 font-extrabold mt-6text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          What is Collector?
        </h2>

        <p>
          Collector is a place to discover, collect, and share beautiful art on
          Solana.
        </p>

        <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          Who can join Collector and how much does it cost?
        </h2>
        <p>Anyone can join Collector and it is 100% free</p>
        <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          Can I connect a ledger wallet?
        </h2>

        <p>
          Yes! Please fill out this form ➡️{" "}
          <Link href="https://bit.ly/Collector_Support">
            <a>Collector Support</a>
          </Link>
        </p>

        <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          How do I follow artists?
        </h2>

        <p>Head to Activity ➡️ Follow Artists</p>

        <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          How do I create my gallery?
        </h2>

        <p>Head to Gallery ➡️ Edit Gallery</p>

        <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
          Questions &amp; Feedback
        </h2>

        <p className="mb-6">
          Please submit any and all questions or feedback here ➡️{" "}
          <Link href="https://bit.ly/Collector_Support">
            <a>Collector Support</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
