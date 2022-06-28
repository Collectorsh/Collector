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
      <div className="bg-black dark:bg-black mt-8 pb-4 dark:border-t dark:border-b dark:border-dark3 mb-12">
        <h1 className="text-4xl font-extrabold text-white text-center pt-4">
          Featured
        </h1>
        <p className="text-whitish text-center mt-3">
          Curated by{" "}
          <Link href="https://twitter.com/artsnip3r">
            <a className="underline">Charty</a>
          </Link>
        </p>
        <div className="bg-black dark:bg-black pt-8">
          <Slider {...settings}>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/post_screw">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/jXuJfVd85FMFoT60192n-c2KGDkDROVho76xm9mSz4g?ext=mp4?ext=mp4",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @Arseniy Valter {"//"} Be3sis
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/3Pscrgg2e">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/ipfs/QmYErTjgq4Fv3vohtRNECT6dFRTZFTPw2Lu7U4HDvgFmBs?quality=100&width=1000&dpr=1",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @Scrog {"//"} User 64
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/youthcloud1">
                <a>
                  <Image
                    token={{
                      image:
                        "https://images-cdn.exchange.art/ipfs/bafybeifhvjfcvmfwmee4ubc2xnq6x3ixtpoipoxxgrt4k57njnbbhs6sym",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @Youthcloud {"//"} The last of sakura
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/belikehats">
                <a>
                  <Image
                    token={{
                      image:
                        "https://collector.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd9e93279-488e-456f-ab19-262c99db1823%2FUntitled.png?table=block&id=c481c5e6-dbae-4a62-a263-9b095fba8c47&spaceId=914cb796-030c-4559-93ed-49b454f68b6b&width=960&userId=&cache=v2",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">@HATS {"//"} Magnus</p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/superjimmer">
                <a>
                  <Image
                    token={{
                      image:
                        "https://collector.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F07ae4768-d7fe-48ca-abf1-9e1ab5ac6a88%2FUntitled.png?table=block&id=92b70f49-bb01-40b9-8bf4-23b035829f17&spaceId=914cb796-030c-4559-93ed-49b454f68b6b&width=1150&userId=&cache=v2",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @Jim Roll {"//"} In the shadow of the gods
              </p>
            </div>
            <div className="px-4 text-center align-center">
              <Link href="https://twitter.com/boywithnolegs">
                <a>
                  <Image
                    token={{
                      image:
                        "https://collector.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe667d114-e7c6-4a04-b273-a5a3e13dd3e0%2FUntitled.png?table=block&id=5e8cc3d6-3296-43fa-8979-e09b4932acf0&spaceId=914cb796-030c-4559-93ed-49b454f68b6b&width=1920&userId=&cache=v2",
                    }}
                  />
                </a>
              </Link>
              <p className="text-gray-100 mt-2 text-sm">
                @NOLEGS {"//"} Trapped In Torment
              </p>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}
