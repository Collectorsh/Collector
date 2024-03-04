import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";
import MainButton from "../MainButton";
import * as Icon from "react-feather";
import { useContext } from "react";
import UserContext from "../../contexts/user";
import SvgCurve from "../svgCurve";
import { collectorBobId } from "../../config/settings";

const LandingHero = () => { 
  const [user] = useContext(UserContext);
  const router = useRouter();
  const isPro = user?.subscription_level === "pro";

  const getStarted = () => {
    router.push("/waitlist");
    // if (isPro) {
    //   if (!user.username) router.push("/settings");
    //   else router.push(`/gallery/${user.username}`);
    // } else {
    //   router.push("/waitlist");
    // }
  }

  const scrollDown = () => { 
    document.getElementById('featuredCurations').scrollIntoView({ behavior: 'smooth'})
    // window.scrollTo({ 
    //   top: window.innerHeight,
    //   left: 0, 
    //   behavior: 'smooth' 
    // });
  }
   
  return (
    <div className="relative">
      {/* <SvgCurve
        color="fill-neutral-200 dark:fill-neutral-800"
        flipped
      /> */}
      <div className="min-h-page mx-auto w-full max-w-screen-xl px-4 sm:px-8 relative flex flex-col items-center justify-between pb-[5%]">
        
        
        {/* 224 is double to size of the nav bar (76px) + 1/2 the image height 72 */}
        <div
          className="min-h-[420px] h-pageImageOffset flex flex-col justify-center items-center gap-16"
        > 

          <div className="">
            <div className="opacity-95 relative">
              <CloudinaryImage
                noLoaderScreen
                className="w-36 h-36 mx-auto dark:invert object-contain"
                id={collectorBobId}
                noLazyLoad
                width={500}
              />
            </div>
            <h1 className="text-center collector text-5xl md:text-7xl font-bold">
              Your Digital Gallery
            </h1>
            <p className="text-center text-xl md:text-2xl mt-6 hidden md:block">
              Curate and discover beautiful art
              {/* Discover, Express, Connect */}
            </p>
          </div>
          <MainButton
            onClick={getStarted}
            solid
            size="xl"
            // className="mt-8 md:mt-16 mx-auto block"
          >
            Join Waitlist!
          </MainButton>
        </div>

      <button
        onClick={scrollDown}
        className="text-lg font-bold flex gap-2 items-center hoverPalette1 rounded-md px-3 py-0.5"//absolute bottom-[5%] left-1/2 -translate-x-[50%] 
      >
        Discover
        <Icon.ArrowDown size={20} strokeWidth={3}/>
      </button>      
      </div>
    </div>
  )
}

export default LandingHero;