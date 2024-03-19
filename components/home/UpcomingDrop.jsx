import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { fetchImages } from "/hooks/fetchImages";
import ContentLoader from "react-content-loader";

export default function UpcomingDrop({ drop }) {
  const [images, setImages] = useState();

  const asyncGetImages = useCallback(async (drop) => {
    const imgs = await fetchImages(drop.slug);
    if (!imgs) return;
    const imgArray = [];
    for (const i of imgs) {
      if (i.Size > 100) imgArray.push(i.Key);
    }
    setImages(imgArray.slice(0, 5));
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
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-6">
        {images ? (
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
                      className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] object-center object-cover"
                    />
                  </div>
                </>
              ))}
            </Slider>
          </div>
        ) : (
          <ContentLoader
            speed={2}
            className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
          >
            <rect className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]" />
          </ContentLoader>
        )}
      </div>
      {drop && (
        <div className="mt-6 lg:mt-0 lg:col-span-5 lg:col-end-13">
          <p>{drop.date}</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            {drop.name}
          </h2>
          <p className="mt-4 whitespace-pre-line">{drop.description}</p>
          <div className="mt-8">
            <Link href={`/drops/${drop.slug}`} title="See the Drop" legacyBehavior>
              <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                See the Drop
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
