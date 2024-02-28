import CloudinaryImage from "../CloudinaryImage";
import SvgCurve from "../svgCurve";

const LandingLetter = () => { 
  //bg-neutral-200 dark:bg-neutral-800 shadow 
  return (
    <div className="pt-28 pb-48 relative bg-neutral-200 dark:bg-neutral-800">
      <SvgCurve
        color="fill-neutral-200 dark:fill-neutral-800"
      />
      <div className="my-10 px-6 md:px-20 mx-auto max-w-screen-lg">
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-md p-2">
          <div className="-rotate-2 rounded-md shadow-md shadow-neutral-500/20">
            <CloudinaryImage
              className="w-full h-auto object-cover rounded-md dark:invert "
              id="global/letter_rvmeh3"
              noLazyLoad
              
            />

          </div>
        </div>  
      </div>
    </div>
  )
}

export default LandingLetter;