import Link from "next/link";
import Slider from "react-slick";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { scrollToFeed } from "/utils/scrollToFeed";

export default function Hero() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>
      <div className="mx-auto px-2 md:px-4 lg:px-12 pb-0 lg:pb-4 bg-white dark:bg-black mt-28">
        <div className="mx-auto px-2 md:px-0">
          <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 mb-8 lg:mb-0">
            <div className="col-span-4 align-middle xl:mr-20 lg:mt-12 mb-6">
              <h1 className="font-bold tracking-wide text-black dark:text-whitish text-center">
                <p className="text-5xl">Collect</p>
                <p className="mt-4 text-5xl">&amp;</p>
                <p className="mt-4 text-5xl">Share</p>
                <p className="mt-6 text-5xl">Beautiful Art</p>
              </h1>

              <div className="my-16 text-center">
                <a
                  className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer"
                  onClick={scrollToFeed}
                >
                  Get Started{" "}
                  <ChevronDownIcon
                    className="h-6 w-6 inline -mt-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
            <div className="lg:gap-y-8 col-end-8 col-span-3 relative">
              <Slider {...settings}>
                <div className="overflow-hidden col-span-2 relative">
                  <Link href="/nightman">
                    <a>
                      <img
                        src="https://cdn.collector.sh/HmPGk2T2caGcLWT3NRyfk4nAb1mP45Hg6wNFJvBQjyQo"
                        alt=""
                        className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-2 left-2 cursor-pointer">
                    Nightman&apos;s Gallery
                  </div>
                </div>
                <div className="overflow-hidden col-span-2 relative">
                  <Link href="/CryptoVulture">
                    <a>
                      <img
                        src="https://cdn.collector.sh/AthbABzFE4b47vQhxjwvf62gZhqwzGBCRPDnxBbQfCuB"
                        alt=""
                        className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-2 left-2 cursor-pointer">
                    CryptoVulture&apos;s Gallery
                  </div>
                </div>
                <div className="overflow-hidden col-span-2 relative">
                  <Link href="/Wetiko">
                    <a>
                      <img
                        src="https://cdn.collector.sh/8bec5JCs47Soz1VnWJt3M3f828FZPtDPH6q5fqBnJjPb"
                        alt=""
                        className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-2 left-2 cursor-pointer">
                    Wetiko&apos;s Gallery
                  </div>
                </div>
                <div className="overflow-hidden col-span-2 relative">
                  <Link href="/laurenceantony">
                    <a>
                      <img
                        src="https://cdn.collector.sh/BMZtCxTWWvQ4GNrypfPjnXHQbD8ULo3FciNeFfybfvus"
                        alt=""
                        className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-2 left-2 cursor-pointer">
                    LaurenceAntony&apos;s Gallery
                  </div>
                </div>
                <div className="overflow-hidden col-span-2 relative">
                  <Link href="/Js">
                    <a>
                      <img
                        src="https://cdn.collector.sh/74xJA3qxVzUbhHEHTSj4xL2CfnCTJhghLWRTMmBbeR8j"
                        alt=""
                        className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="bg-black text-white rounded-3xl px-4 py-2.5 absolute top-2 left-2 cursor-pointer">
                    Js&apos;s Gallery
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
