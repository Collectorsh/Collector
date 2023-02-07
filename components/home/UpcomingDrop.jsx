import Link from "next/link";
import Slider from "react-slick";

export default function UpcomingDrop() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  const bonkImages = () => {
    const rows = [];
    for (let i = 1; i < 102; i++) {
      rows.push(i);
    }
    const rand = rows.sort(() => 0.5 - Math.random()).slice(0, 6);
    return rand;
  };

  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <Slider {...settings}>
              {bonkImages().map((item, index) => (
                <>
                  <div
                    key={index}
                    className="overflow-hidden col-span-2 relative -mt-2"
                  >
                    <img
                      src={`https://cdn.collector.sh/drops/bonk/${item}.png`}
                      alt=""
                      className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                    />
                  </div>
                </>
              ))}
            </Slider>
          </div>
        </div>
        <div className="sm:col-span-5 sm:col-end-13">
          <p>February 8th, 12pm EST</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            Bonk
          </h2>
          <p className="mt-4">Open to all artists on Solana, minted in Bonk.</p>
          <p className="mt-4">
            50% of mint proceeds will be burned and 50% distributed equally to
            all participating artists.
          </p>
          <div className="mt-8">
            <Link href="/drops/bonk" title="Bonk">
              <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                See the Drop
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
