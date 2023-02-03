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

  const images = [
    {
      image: "GBDtAqKHmwgLLP1aT9ewNV2JmA8hyRGn7ti1TV3dxWM2",
      artist: "Rupture",
    },
    {
      image: "B19qdEHeYmjtbiCzeXbkwAGF9KCwRK85biAHKU9Hx8Sv",
      artist: "Laurence Antony",
    },
    {
      image: "AjW4NNcwVA8LHaGfrisdbMnqPfkFfYZdCtztTikQ8NRN",
      artist: "Tony Tafuro",
    },
    { image: "H78kBdBzioQn1HKPgGhp5wF9bJ7dvEQRSaHomwnxmJtp", artist: "Sleepr" },
    {
      image: "HYzRfSo6iVNoPmD43jfpUU1d4EwHPEgwC5MsRrExAMbp",
      artist: "Lisanne Haack",
    },
    {
      image: "9W5QWbdDjTS7ExLWhfrQb86QmsL59EacHC1LShHGwE7A",
      artist: "Holly Herbert",
    },
    {
      image: "rtoDoDPnULqmJJYavfEjr2SGowWShr5cDBs8TPeLnQc",
      artist: "ADHD (Space Case)",
    },
  ].sort(() => 0.5 - Math.random());

  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <Slider {...settings}>
              {images.map((item, index) => (
                <>
                  <div
                    key={index}
                    className="overflow-hidden col-span-2 relative -mt-2"
                  >
                    <img
                      src={`https://cdn.collector.sh/drops/rupture/${item.image}.png`}
                      alt=""
                      className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-2 text-center dark:text-white">
                    <h2 className="font-bold">{item.artist}</h2>
                  </div>
                </>
              ))}
            </Slider>
          </div>
        </div>
        <div className="sm:col-span-5 sm:col-end-13">
          <p>February 6th, 6pm EST</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            Monochromatic Dreams, 2023
          </h2>
          <p>
            Curated by{" "}
            <Link href="https://twitter.com/RuptureNFT" title="Rupture">
              <a target="_blank">Rupture</a>
            </Link>
          </p>
          <p className="mt-4">7 artists, 15 editions each.</p>
          <p className="mt-4">
            Featuring Holly Herbert, Laurence Antony, Lisanne Haack, Rupture,
            Sleepr, Space Case and Tony Tafuro.
          </p>
          <div className="mt-8">
            <Link href="/drops/rupture" title="Monochromatic Dreams">
              <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                See the Drop
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="mt-12 mb-6 text-4xl font-bold">Artists</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          <div className="text-center">
            <Link
              href="https://twitter.com/@laurence_antony"
              title="Laurence Antony"
            >
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/laurence.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@ohareyoufat" title="Tony Tafuro">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/tonyt.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@sleeprNFT" title="Sleepr">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/sleepr.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@paranoidhill"
              title="Lisanne Haack"
            >
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/lisanne.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@HollyHerbertAr1"
              title="Holly Herbert"
            >
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/holly.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@adhd143" title="ADHD (Space Case)">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/adhd.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@RuptureNFT" title="Ruptrue">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/rupture.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
