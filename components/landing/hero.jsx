import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";
import MainButton from "../MainButton";
import * as Icon from "react-feather";
import { useContext } from "react";
import UserContext from "../../contexts/user";
import SvgCurve from "../svgCurve";

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
      <div className="h-[calc(100svh-76px)] w-full max-w-screen-xl mx-auto px-4 sm:px-8">
        
        
        {/* 224 is double to size of the nav bar (76px) +the image height 72 */}
        <div className="h-[calc(100%-224px)] flex flex-col justify-center items-center gap-8 md:gap-16"> 

          <div className="flex flex-col justify-center items-center">
            <div className="opacity-95 relative">
              <CloudinaryImage
                noLoaderScreen
                className="w-36 h-36 mx-auto dark:invert object-contain"
                id="global/Collector-mascot-transparent_qsqcwx"
                noLazyLoad
                width={500}
              />
            </div>
            <h1 className="text-center collector text-5xl md:text-7xl font-bold">
              Your Digital Gallery
            </h1>
          </div>
            <MainButton
              onClick={getStarted}
              solid
              size="xl"
            >
              Join Waitlist!
            </MainButton>
        </div>
        <button
          onClick={scrollDown}
          className="absolute bottom-[5%] left-1/2 -translate-x-[50%] text-lg font-bold flex gap-2 items-center hoverPalette1 rounded-md px-3 py-0.5"
        >
          Discover
          <Icon.ArrowDown size={20} strokeWidth={3}/>
        </button>

        
      </div>

    </div>
  )
}

export default LandingHero;