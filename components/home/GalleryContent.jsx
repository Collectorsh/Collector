import Link from "next/link";
import { cdnImage } from "/utils/cdnImage";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { addDefaultSource } from "../../utils/addDefaultSource";

export default function GalleryContent({ name, items }) {
  const loadingSlides = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <SwiperSlide key={`slide-${ index }`}>
        <div className="md:p-4">
          <div
            className="bg-gray-300/20 lg:shadow-lg rounded-xl relative p-3 mx-auto"
          >
            <ContentLoader
              speed={2}
                className="w-full mb-4 h-[250px] rounded-lg"
              backgroundColor="#bbbbbb"
              foregroundColor="#aaaaaa"
            >
              <rect className="w-full h-full" />
            </ContentLoader>
            <ContentLoader
              speed={2}
              className="w-full h-8 mt-2"
              backgroundColor="#bbbbbb"
              foregroundColor="#aaaaaa"
            >
              <circle cx="16" cy="16" r="16" />
              <rect x="46" y="5" className="w-[80%] h-3/4" rx="4" />
            </ContentLoader>
          </div>
        </div>

      </SwiperSlide>
    ))
  }

  const imageSlides = () => { 
    return items.map((item, index) => {
      if (item.image.includes("cdn.collector.sh")) return null;
      return (
        <SwiperSlide key={item.mint + index}>
          <div className="md:p-4">
            <div
              className="bg-gray-300/20 md:shadow-lg rounded-xl overflow-hidden relative p-3 mx-auto"
            >
              <div className="rounded-lg overflow-hidden flex justify-center items-center mb-4 relative h-[250px]">
                <Link href={`/${ item.username }`}>
                  <a>
                    <img
                      src={cdnImage(item.mint)}
                      onError={(e) => addDefaultSource(e, item.mint, item.image)}
                      className="rounded-lg flex-shrink-0 absolute inset-0 w-full h-full object-cover"
                    />
                  </a>
                </Link>
              </div>
              <div className="mt-2">
                <Link href={`/${ item.username }`}>
                  <a>
                    {item.twitter_profile_image && (
                      <img
                        src={item.twitter_profile_image}
                        className="w-8 h-8 mr-1.5 rounded-full float-left"
                        onError={(e) => {                                 
                          e.target.className = "hidden"
                        }}
                      />
                    )}

                    <div className="mt-2">
                      {item.username && (
                        <p className="inline font-bold leading-7">
                          {item.username}
                        </p>
                      )}
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <div
      id="feed"
      className="rounded-xl lg:p-4"
    >
      <h2 className="font-semibold mb-3 ml-4">
        {name}
      </h2>
      <Swiper
        navigation
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }}
      >
        {items
          ? imageSlides()
          : loadingSlides()
        }
      </Swiper>
    </div>
  )
}
