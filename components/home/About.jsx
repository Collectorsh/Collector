import Link from "next/link";
import Slider from "react-slick";

export default function About() {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="lg:col-span-2 mb-4 bg-black dark:bg-white">
        <h1 className="text-4xl font-extrabold text-white dark:text-blck text-center mb-10 pt-4">
          Collector Features
        </h1>
        <div>
          <Slider {...settings}>
            <div className="h-[300px] px-4">
              <div className="bg-burple rounded-lg h-[300px]">
                <p className="text-white text-lg font-bold text-center pt-1 pb-1">
                  Curate Your Gallery
                </p>
                <img
                  src="/images/curate.png"
                  alt=""
                  className="object-top object-cover w-full px-4 mb-4 h-[250px]"
                />
              </div>
            </div>
            <div className="h-[300px] px-4">
              <div className="bg-burple rounded-lg h-[300px]">
                <p className="text-white text-lg font-bold text-center pt-1 pb-1">
                  Follow Your Favorite Artists
                </p>
                <img
                  src="/images/follow.png"
                  alt=""
                  className="object-top object-cover w-full px-4 mb-4 h-[250px]"
                />
              </div>
            </div>
            <div className="h-[300px] px-4">
              <div className="bg-burple rounded-lg h-[300px]">
                <p className="text-white text-lg font-bold text-center pt-1 pb-1">
                  View Followed Artits Live Auctions
                </p>
                <img
                  src="/images/watchlist.png"
                  alt=""
                  className="object-top object-cover w-full px-4 mb-4 h-[250px]"
                />
              </div>
            </div>
            <div className="h-[300px] px-4">
              <div className="bg-burple rounded-lg h-[300px]">
                <p className="text-white text-lg font-bold text-center pt-1 pb-1">
                  Keep Track of Your Open Bids
                </p>
                <img
                  src="/images/bids.png"
                  alt=""
                  className="object-top object-cover w-full px-4 mb-4 h-[250px]"
                />
              </div>
            </div>
          </Slider>
        </div>
        <div className="mt-12 text-center">
          <Link href="/pricing" legacyBehavior>
            <a className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer">
              View Pricing
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
