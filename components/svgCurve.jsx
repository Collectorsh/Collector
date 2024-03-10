import { useRef } from "react";
import clsx from "clsx";
import useElementObserver from "../hooks/useElementObserver";


const SvgCurve = ({
  color = "fill-neutral-50 dark:fill-neutral-950",
  turned,
  flipped,
  position = "top-0 left-0",
}) => {
  const ref = useRef(null)
  const { isVisible } = useElementObserver(ref, "200px")

  return (
    <div
      className={clsx(
        "w-full absolute origin-top",
        position,
        color,
        flipped ? "rotate-0" : "rotate-180",
        turned ? "scale-x-[-1]" : "scale-x-100",
      )}
      ref={ref}
    >
      <svg
        className={clsx("origin-top duration-[3s]", isVisible ? "scale-y-90 md:scale-y-75" : "scale-y-0")}
        id="eXG2ySV0chP1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 150"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision">
        <path d="M-1.214312,6.402817c0-6.837986,0,0,0-6.837986c273.010224,0,1010.741914,0,1600.706868,0c0,6.837986-.706868,6.837986-.140483,6.837986C1449.012816,6.402817,1499.344887,150,1302.036029,150s-305.254433-138.563309-703.609379-138.563309c-239.448437,0-365.549138,28.490494-447.928113,28.490494s-98.736008-33.524368-151.712849-33.524368Z" transform="translate(1.214312 0.435169)" strokeWidth="3.072" />
      </svg>
    </div>
  )
}

export default SvgCurve
