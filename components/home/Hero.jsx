import { useState, useEffect, useCallback, useContext } from "react";
import getAllDrops from "/data/drops/getAllDrops";
import UpcomingDrop from "/components/home/UpcomingDrop";
import GalleryImages from "/components/home/GalleryImages";
import CollectorListing from "/components/home/CollectorListing";
import ContentLoader from "react-content-loader";
import UserContext from "../../contexts/user";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";

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
      <div className="grid gap-10 items-center mt-16 ">
        <div className="text-center" >
          {/* <p className="text-6xl collector">Discover & Share <br/>Beautiful Art on Solana</p> */}

          <p className="text-6xl collector leading-36">Collect, Curate, and Discover<br /> Beautiful Art</p>
          {/* <button
            onClick={handleCurate}
            className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black
             mt-10 py-3 px-6 rounded-lg text-lg font-bold duration-300 active:scale-95">
            Curate Your Gallery
          </button> */}
        </div>
        
        {/* <div className="bg-gray-300/20 lg:shadow-lg p-3 rounded-xl delay-200 animate-enter w-fit mx-auto">
          <CloudinaryImage
            id="global/hero-gal-dark.png"
            className="hidden dark:block rounded-lg overflow-hidden"
            width={1200}
            noLazyLoad
          />
          <CloudinaryImage
            id="global/hero-gal-light.png"
            className="dark:hidden rounded-lg overflow-hidden"
            width={1200}
            noLazyLoad
          />
        </div>           */}
      </div>
    </div>
  );
}
