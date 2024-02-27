import { useMemo } from "react"
import clsx from "clsx";
import * as Icon from 'react-feather'
import Tippy from "@tippyjs/react";

export const socialTypes = ["twitter", "instagram", "other"]
export const getIcon = (type) => { 
  switch (type) { 
    case "twitter": return <TwitterIcon className="w-4 h-4" />
    case "instagram": return <InstaIcon className="w-5 h-5" />
    case "other":
    default: return <Icon.Globe size={20} />
  }
}

const SocialLink = ({
  type, link,className
}) => {
  const icon = useMemo(() => getIcon(type), [type])
  const href = link.includes("//") ? link : `//${ link }`
  return (
    <Tippy content={link} className="shadow">
      <a href={href} className={clsx("opacity-75 hover:opacity-100 transition hoverPalette1 rounded-md p-1.5",className)}>
        {icon}
      </a>

    </Tippy>
  )
}

export default SocialLink;

export const TwitterIcon = ({ className }) => (
  <svg
    viewBox="0 0 1200 1227"
    xmlns="http://www.w3.org/2000/svg"
    className={clsx("fill-current stroke-2", className)}
  >
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
  </svg>

)

export const InstaIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={clsx("fill-current", className)}
  >
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
)