import { useState, useEffect, useCallback } from "react";
import getAllDrops from "/data/drops/getAllDrops";
import UpcomingDrop from "/components/home/UpcomingDrop";
import GalleryImages from "/components/home/GalleryImages";
import CollectorListing from "/components/home/CollectorListing";
import ContentLoader from "react-content-loader";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [drop, setDrop] = useState();
  const [showGalleries, setShowGalleries] = useState(false);
  const [showListing, setShowListing] = useState(false);

  const signedIn = true;

  // const asyncGetDrop = useCallback(async () => {
  //   let drops = await getAllDrops();
  //   if (drops) {
  //     let d = drops.filter((d) => d.highlight === true)[0];
  //     if (d) {
  //       setDrop(d);
  //     } else {
  //       // setShowGalleries(true);
  //       if (Math.round(Math.random() * 2) === 1) {
  //         setShowGalleries(true);
  //       } else {
  //         setShowListing(true);
  //       }
  //     }
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   asyncGetDrop();
  // }, []);

  return (
    <div className="py-6 sm:py-12 mx-auto dark:text-white">
      {/* <div className="grid lg:grid-cols-2 items-center mb-10">
        <div className="text-center" >
          <h1 className="animate-enter text-5xl lg:text-8xl font-bold">Collect<span className="w-7 h-7 lg:w-14 lg:h-14 rounded-full bg-greeny inline-block -mt-0.5"></span>r</h1>
          <p className="text-lg mt-2 collector">Discover and share beautiful art</p>
          <button
            className="bg-greeny text-black mt-10 py-3 px-6 rounded-full text-lg font-bold duration-300 hover:scale-105 active:scale-100">
            {signedIn ? "View Your Gallery" : "Sign In To Get Started"}
          </button>
        </div>
          <div className="hidden lg:block bg-gallery_background dark:bg-dark1 rounded-3xl p-6">
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="">
                <p className="text-white text-sm font-bold">
                  Drag &amp; Drop to curate
                </p>
                <div className="bg-white p-2 rounded-xl mt-3">
                  <img src="/images/gallery1.png" />
                </div>
              </div>
              <div className="">
                <p className="text-white text-sm font-bold">
                  Share with the world
                </p>
                <div className="bg-white p-2 rounded-xl mt-3">
                  <img src="/images/gallery2.png" />
                </div>
              </div>
            </div>
          </div>
      </div> */}


      <h2 className="text-4xl font-bold mb-8">Spotlight</h2>
      <div className="min-h-[100vw] lg:min-h-[520px] xl:min-h-[550px]">
        <GalleryImages />
        {/* {loading ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <ContentLoader
                  speed={2}
                  className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] rounded-xl"
                  backgroundColor="#bbbbbb"
                  foregroundColor="#aaaaaa"
                >
                  <rect className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]" />
                </ContentLoader>
              </div>
            </div>
          </>
        ) : (
            <>
              
            {drop && <UpcomingDrop drop={drop} />}
            {showGalleries && <GalleryImages />}
            {showListing && <CollectorListing />}
          </>
        )} */}
      </div>
    </div>
  );
}
