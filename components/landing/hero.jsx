import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";
import MainButton from "../MainButton";
import * as Icon from "react-feather";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/user";
import SvgCurve from "../svgCurve";
import { collectorBobId } from "../../config/settings";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const LandingHero = () => { 
  const [user] = useContext(UserContext);
  const wallet = useWallet();
  const {setVisible}=  useWalletModal()
  const router = useRouter();
  const isPro = true//user?.subscription_level === "pro";

  const [justConnected, setJustConnected] = useState(false)

  const getStarted = () => {
    if (!wallet.connected) {
      setVisible(true)
      setJustConnected(true)
    }
    else if (!user?.username) router.push("/settings");
    else router.push(`/${user?.username}`);
  }

  useEffect(() => {
    if(user?.username && wallet?.connected && justConnected) {
      router.push(`/${user.username}`)
    }
  },[user, justConnected, wallet.connected, router])

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
        
        <div
          className="min-h-[420px] h-pageImageOffset flex flex-col justify-center items-center gap-12 md:gap-16"
        > 
          <div className="">
            <div className="opacity-95 relative">
              <CloudinaryImage
                noLoaderScreen
                className="w-32 h-32 md:w-36 md:h-36 mx-auto dark:invert object-contain"
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
            Get Started!
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