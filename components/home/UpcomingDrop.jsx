import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { fetchImages } from "/hooks/fetchImages";
import getAllDrops from "/data/drops/getAllDrops";

export default function UpcomingDrop() {
  const [images, setImages] = useState([]);
  const [drop, setDrop] = useState([]);

  const asyncGetDrop = useCallback(async () => {
    let drops = await getAllDrops();
    let d = drops.filter((d) => d.highlight === true)[0];
    setDrop(d);
  }, []);

  useEffect(() => {
    asyncGetDrop();
  }, []);

  const asyncGetImages = useCallback(async (drop) => {
    const imgs = await fetchImages(drop.slug);
    if (!imgs) return;
    const imgArray = [];
    for (const i of imgs) {
      if (i.Size > 100) imgArray.push(i.Key);
    }
    setImages(imgArray);
  }, []);

  useEffect(() => {
    if (!drop) return;
    asyncGetImages(drop);
  }, [drop]);

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

  return (
    <div className="bg-gray-50 dark:bg-dark1 py-6 sm:py-12 mx-auto px-4 xl:px-0 dark:text-white">
      <div className="max-w-7xl mx-auto min-h-[100vw] lg:min-h-[520px] xl:min-h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {images && (
              <div className="text-center">
                <Slider {...settings}>
                  {images.map((image, index) => (
                    <>
                      <div
                        key={index}
                        className="overflow-hidden col-span-2 relative -mt-2"
                      >
                        <img
                          src={`https://cdn.collector.sh/${image}`}
                          alt=""
                          className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover rounded-lg"
                        />
                      </div>
                    </>
                  ))}
                </Slider>
              </div>
            )}
          </div>
          {drop && (
            <div className="mt-6 lg:mt-0 lg:col-span-5 lg:col-end-13">
              <p>{drop.date}</p>
              <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
                {drop.name}
              </h2>
              <p className="mt-4">{drop.description}</p>
              <div className="mt-8">
                <Link href={`/drops/${drop.slug}`} title="Bonk">
                  <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                    See the Drop
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
