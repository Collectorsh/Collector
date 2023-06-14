import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white bg-neutral-100">
      <div className="pt-16 max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 pb-4">
          <div>
            {/* <h1 className="col-span-2 sm:col-span-1 text-2xl">Collector</h1> */}
            <Link href="/">
              <a className="collector text-3xl font-bold">
                collect<span className="w-[1.05rem] h-[1rem] rounded-[0.5rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r
              </a>
            </Link>
            <p className="mt-2">Discover & share beautiful art</p>
          </div>
          <div className="mt-8 sm:mt-0 col-span-2 sm:col-span-1 align-right">
            <div className="float-left sm:float-right">
              <Link href="/about">
                <a className="inline mr-6">About</a>
              </Link>
              <Link href="/terms">
                <a className="inline mr-6">Terms</a>
              </Link>
              <Link href="/privacy">
                <a className="inline mr-6">Privacy</a>
              </Link>
              <Link href="https://twitter.com/collector_sh">
                <a target="_blank">
                  <icon icon="twitter" svgclass="w-6 h-6">
                    <svg-icon>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="fillCurrent"
                        stroke="strokeCurrent"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline w-6 h-6 fill-gray-900 dark:fill-gray-50"
                        aria-hidden="true"
                      >
                        <path d="M7.55016 21.75C16.6045 21.75 21.5583 14.2467 21.5583 7.74186C21.5583 7.53092 21.5536 7.3153 21.5442 7.10436C22.5079 6.40746 23.3395 5.54425 24 4.5553C23.1025 4.9546 22.1496 5.21538 21.1739 5.32874C22.2013 4.71291 22.9705 3.74547 23.3391 2.60577C22.3726 3.17856 21.3156 3.58261 20.2134 3.80061C19.4708 3.01156 18.489 2.48912 17.4197 2.31405C16.3504 2.13899 15.2532 2.32105 14.2977 2.8321C13.3423 3.34314 12.5818 4.15471 12.1338 5.14131C11.6859 6.12792 11.5754 7.23462 11.8195 8.2903C9.86249 8.19209 7.94794 7.6837 6.19998 6.7981C4.45203 5.91249 2.90969 4.66944 1.67297 3.14952C1.0444 4.23324 0.852057 5.51565 1.13503 6.73609C1.418 7.95654 2.15506 9.02345 3.19641 9.71999C2.41463 9.69517 1.64998 9.48468 0.965625 9.10592V9.16686C0.964925 10.3041 1.3581 11.4066 2.07831 12.2868C2.79852 13.167 3.80132 13.7706 4.91625 13.995C4.19206 14.1931 3.43198 14.222 2.69484 14.0794C3.00945 15.0574 3.62157 15.9129 4.44577 16.5263C5.26997 17.1398 6.26512 17.4806 7.29234 17.5012C5.54842 18.8711 3.39417 19.6141 1.17656 19.6106C0.783287 19.61 0.390399 19.5859 0 19.5384C2.25286 20.9837 4.87353 21.7514 7.55016 21.75Z"></path>
                      </svg>
                    </svg-icon>
                  </icon>
                </a>
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="border-t border-neutral-200 dark:border-neutral-800 pb-4"></div> */}
        <div className="text-sm py-12">Copyright 2023</div>
      </div>
    </div>
  );
}
