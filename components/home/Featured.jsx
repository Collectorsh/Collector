import Link from "next/link";
import Slider from "react-slick";
import Image from "/components/Image";

export default function Featured() {
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
      <div className="w-[200px] h-[1px] bg-black dark:bg-whitish mx-auto mt-10"></div>
      <h1 className="text-4xl font-extrabold text-black dark:text-whitish text-center pt-8">
        Featured
      </h1>
      <div className="bg-black dark:bg-black mt-8 pb-4 dark:border-t dark:border-b dark:border-dark3">
        <div className="bg-black dark:bg-black pt-8">
          <Slider {...settings}>
            <div className="px-4 text-center align-center">
              <Link href={`/CultureHacker`}>
                <a>
                  <Image
                    token={{
                      image:
                        "https://cdn.collector.sh/43EX7Fyve884g9miSrW9fGNHhca5bwkzJJiGEG9sY5mr",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @CultureHacker {"//"} Collector
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://formfunction.xyz/@ilanderech/9Q4rdiTyQgfabRvCBdug1wdNYY3USt6okCbaGSYsL6JN">
                <a>
                  <Image
                    token={{
                      image:
                        "https://cdn.collector.sh/9Q4rdiTyQgfabRvCBdug1wdNYY3USt6okCbaGSYsL6JN",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @IDerech {"//"} Formfunction
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://exchange.art/artists/douglas%20/nfts">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/zfx9cVDB4T1dqhvefDjNCwWZ5XQjy0pIvxLrVCtaViM?ext=jpg?ext=jpg&quality=100&width=1000&dpr=1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @Douglas {"//"} Exchange.Art
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://formfunction.xyz/@CryptoVulture">
                <a>
                  <Image
                    token={{
                      image:
                        "https://cdn.collector.sh/84fdcc3s3xnUZw2F6kgUeGhnL6gPLANHRQBWJJ4duEfh",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @CryptoVulture {"//"} Formfunction
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://exchange.art/series/Analog%20Nights/nfts">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/VZ8FvgkhG4TewQs35Hyaufp3s9OseQ9RDAfDzujOC44?ext=jpg?ext=jpg&quality=100&width=1000&dpr=1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @TrevElViz {"//"} Exchange.Art
              </p>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}
