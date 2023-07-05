import Link from "next/link";
import { cdnImage } from "/utils/cdnImage";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { addDefaultSource } from "../../utils/addDefaultSource";
import axios from "axios";
import { useState } from "react";
import CloudinaryImage from "../CloudinaryImage";

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
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
            >
              <rect className="w-full h-full" />
            </ContentLoader>
            <ContentLoader
              speed={2}
              className="w-full h-8 mt-2"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
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
      // if (item.image.includes("cdn.collector.sh")) return null;
      return (
        <SwiperSlide key={item.mint + index}>
          <ImageSlide item={item} />
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

const ImageSlide = ({ item }) => {
  const [errorCount, setErrorCount] = useState(0);
  
  const defaultSource = async (e, mint, url) => {
    e.target.style.background = "black";
    e.target.style.opacity = 0;
    if (!url) return;

    if(errorCount > 1) return
    setErrorCount(errorCount + 1)
    try {
      const res = await axios.get(url).then(res => res.data);
      const image = typeof res.image === "object" ? res.image : url
      e.target.src = image;
      e.target.style.opacity = 1;
    } catch (err) {
      console.log(err);
    }
  }
  return(
    <div className="md:p-4">
      <div
        className="bg-gray-300/20 md:shadow-lg rounded-xl overflow-hidden relative p-3 mx-auto"
      >
        <Link href={`/${ item.username }`}>
          <a >
            {/* <div className="w-full h-full"> */}
              <CloudinaryImage
                id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ item.mint }`}
                mint={item.mint}
                width={700}
                noLazyLoad
                useUploadFallback
                className="rounded-lg flex-shrink-0 w-full h-[250px] object-cover"
              />
            {/* </div> */}

          </a>
        </Link>
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
  )
}