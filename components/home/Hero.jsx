import { useState, useEffect, useCallback, useContext } from "react";
import getAllDrops from "/data/drops/getAllDrops";
import UpcomingDrop from "/components/home/UpcomingDrop";
import GalleryImages from "/components/home/GalleryImages";
import CollectorListing from "/components/home/CollectorListing";
import ContentLoader from "react-content-loader";
import UserContext from "../../contexts/user";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

export default function Hero() {
  const [user, setUser] = useContext(UserContext);
  const { setVisible } = useWalletModal()
  const router = useRouter();


  // const [loading, setLoading] = useState(true);
  // const [drop, setDrop] = useState();
  // const [showGalleries, setShowGalleries] = useState(false);
  // const [showListing, setShowListing] = useState(false);

  // const signedIn = true;

  const handleCurate = () => { 
    if(!user) {
      setVisible(true)
    } else {
      router.push("/edit")
    }
  }

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
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-10 ">
        <div className="text-center" >
          <p className="text-4xl mt-2 collector">Discover & Share <br/>Beautiful Art on Solana</p>
          <button
            onClick={handleCurate}
            className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black
             mt-10 py-3 px-6 rounded-lg text-lg font-bold duration-300 active:scale-95">
            Curate Your Gallery
          </button>

          {/* <div className="mt-20 collector flex justify-around flex-wrap">
            <p>4.1k+ galleries</p>
            |
            <p>11.3k+ artists</p>
            |
            <p>54k+ artworks</p>
          </div> */}
        </div>
        
        <div className="bg-gray-300/20 lg:shadow-lg p-3 rounded-xl delay-200 animate-enter">
          <img className="dark:hidden rounded-lg" src="/images/hero-gal-light.png" />
          <img className="hidden dark:block rounded-lg" src="/images/hero-gal-dark.png" />
        </div>          
      </div>




      {/* <h2 className="text-4xl font-bold mb-8">Spotlight</h2>
      <div className="min-h-[100vw] lg:min-h-[520px] xl:min-h-[550px]">
        <GalleryImages />
        {loading ? (
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
        )}
      </div> */}
    </div>
  );
}
