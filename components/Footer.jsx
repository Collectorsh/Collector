import Link from "next/link";
import { TwitterIcon } from "./SocialLink";
import CloudinaryImage from "./CloudinaryImage";
import { collectorLogoId } from "../config/settings";

export default function Footer() {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white bg-neutral-100">
      <div className="pt-16 max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 pb-4">
          <div>
            {/* <h1 className="col-span-2 sm:col-span-1 text-2xl">Collector</h1> */}
            {/* <Link href="/">
              <a className="collector text-3xl font-bold">
                collect<span className="w-[1.05rem] h-[1rem] rounded-[0.5rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r
              </a>
            </Link> */}
            <Link href="/">
              <a className="rounded-md px-3 py-2 hoverPalette1 relative -left-3 block w-fit">
                {/*collector text-3xl font-bold flex items-center// collect<span className="w-[1.05rem] h-[1rem] rounded-[0.5rem] bg-neutral-900 dark:bg-neutral-100 inline-block -mb-[0.35rem] mx-[0.06rem]"></span>r */}
                <CloudinaryImage
                  id={collectorLogoId}
                  className="w-auto h-6 object-contain dark:invert"
                  noLazyLoad
                  width={500}
                  noLoaderScreen
                />
              </a>


            </Link>
            <p className="mt-2">Curate and discover beautiful art</p>
          </div>
          <div className="mt-8 sm:mt-0 col-span-2 sm:col-span-1 align-right">
            <div className="float-left sm:float-right flex items-center gap-2">
              {/* <Link href="/about">
                <a className="">About</a>
              </Link> */}
              <Link href="/faq">
                <a className="hoverPalette2 rounded px-2">FAQ</a>
              </Link>
              <Link href="/terms">
                <a className="hoverPalette2 rounded px-2">Terms</a>
              </Link>
              <Link href="/privacy">
                <a className="hoverPalette2 rounded px-2">Privacy</a>
              </Link>
              <Link href="https://twitter.com/collector_sh">
                <a target="_blank" className="hoverPalette2 rounded-full p-1.5">
                  <TwitterIcon className="w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="border-t border-neutral-200 dark:border-neutral-800 pb-4"></div> */}
        <div className="text-sm py-12">Copyright { new Date().getFullYear()}</div>
      </div>
    </div>
  );
}
