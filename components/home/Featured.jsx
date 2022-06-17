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
      <p className="text-center mt-4">
        Curated by{" "}
        <Link href="https://twitter.com/CompoundI3">
          <a className="underline">Compound</a>
        </Link>
      </p>
      <div className="bg-black dark:bg-black mt-8 pb-4 dark:border-t dark:border-b dark:border-dark3 mb-12">
        <div className="bg-black dark:bg-black pt-8">
          <Slider {...settings}>
            <div className="px-4 text-center align-center">
              <Link href="https://exchange.art/artists/Sleepr/nfts">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/ipfs/bafybeihl5eww7ubuvn3yequtoly3gyc4f5aanc3beoqllrwjbvfkw3gyqa?ext=jpg&quality=100&width=1000&dpr=1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @sleeprNFT {"//"} Exchange.Art
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://exchange.art/artists/J.T.%20Liss/nfts">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/ku5m_lPhkaLm195euLpnVR0Hwd0vJg6co_zd4LJ1LDo?ext=jpg?ext=jpg&quality=100&width=1000&dpr=1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @JTLissPhotoArt {"//"} Exchange.Art
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://formfunction.xyz/@laurenceantony">
                <a>
                  <Image
                    token={{
                      image:
                        "https://cdn.collector.sh/72kPXftajfA8sfs9XM6aDCUXDMPwZxisBvYK7SaUaxf1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @laurence_antony {"//"} Formfunction
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://exchange.art/artists/Degen%20Poet/nfts">
                <a>
                  <Image
                    token={{
                      image:
                        "https://collector.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F786a758e-309d-4673-887f-f018a851ddb5%2FUntitled.png?table=block&id=e09a011f-0f94-4d35-9608-01ab6f924b01&spaceId=914cb796-030c-4559-93ed-49b454f68b6b&width=1060&userId=&cache=v2",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @degenpoet {"//"} Exchange.Art
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://formfunction.xyz/@kiramoto">
                <a>
                  <Image
                    token={{
                      image:
                        "https://collector.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F3d86abc7-015e-4f48-977c-26cebfa608b1%2FUntitled.png?table=block&id=06c128d5-465b-4c3b-b625-056e89df329f&spaceId=914cb796-030c-4559-93ed-49b454f68b6b&width=1150&userId=&cache=v2",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @kiramotosan {"//"} Formfunction
              </p>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}
