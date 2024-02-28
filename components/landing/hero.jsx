import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";
import MainButton from "../MainButton";
import * as Icon from "react-feather";
import { useContext } from "react";
import UserContext from "../../contexts/user";

const LandingHero = () => { 
  const [user] = useContext(UserContext);
  const router = useRouter();
  const isPro = user?.subscription_level === "pro";

  const getStarted = () => {
    if (isPro) {
      if (!user.username) router.push("/settings");
      else router.push(`/gallery/${user.username}`);
    } else {
      router.push("/waitlist");
    }
  }

  const scrollDown = () => { 
    window.scrollTo({ 
      top: window.innerHeight - 76, // could be negative value
      left: 0, 
      behavior: 'smooth' 
    });
  }
   
  return (
    <div className="h-screen w-full max-w-screen-xl mx-auto px-4 sm:px-8">
      {/* 300 is triple to size of the nav bar (76px) + half the image height 72 */}
      <div className="h-[calc(100%-300px)] flex flex-col justify-center items-center gap-16"> 

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
          <h1 className="text-center collector text-5xl md:text-7xl font-semibold">
            your digital gallery
          </h1>
        </div>
          <MainButton
            onClick={getStarted}
            // className="mb-8"
            solid
            size="xl"
          >
            Get Started!
          </MainButton>
      </div>
      <button
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-[50%] text-lg font-bold flex gap-2 items-center hoverPalette1 rounded-md px-3 py-0.5"
      >
        Discover
        <Icon.ArrowDown size={20} strokeWidth={3}/>
      </button>
    </div>

  )
}

export default LandingHero;