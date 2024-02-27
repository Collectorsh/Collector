import { useRouter } from "next/router";
import CloudinaryImage from "../CloudinaryImage";
import MainButton from "../MainButton";

const LandingHero = () => { 
  const router = useRouter();
  const goToWaitlist = () => { 
    router.push("/waitlist");
  }
  return (
    <div className="grid md:grid-cols-2 mb-20 
    max-w-screen-2xl mx-auto px-6 lg:px-16">
      {/* <p className="text-6xl collector leading-[5rem] text-center pt-16 pb-6 md:py-32">Collect, Curate, and Discover<br /> Beautiful Art</p> */}

      <div className="text-center collector pt-16 pb-6 md:py-28">
        <p className="text-5xl">collect</p>
        <p className="text-6xl">curate</p>
        <p className="text-7xl">discover</p>
        <p className="text-[5rem] leading-none">beautiful art</p>
      </div>

      {/* <div className="text-center pt-16 pb-6 md:py-28">
        <p className="text-8xl collector">collect<span className="w-[3.05rem] h-[3rem] rounded-[1.45rem] bg-neutral-900 dark:bg-neutral-100 inline-block"></span>r</p>
        <p className="text-xl">Collect, Curate, and Discover Beautiful Art</p>
      </div> */}

      <div className="flex flex-col h-full justify-center items-center">
        <div className="opacity-95">
          <CloudinaryImage
           
            className="w-36 h-36 mx-auto dark:invert"
            id="global/Collector-mascot-transparent_qsqcwx"
            noLazyLoad
            width={500}
          />
        </div>
        <MainButton
          onClick={goToWaitlist}
          className="mb-8"
          solid
          size="xl"
        >
          Join the waitlist!
        </MainButton>
      </div>
    </div>

  )
}

export default LandingHero;