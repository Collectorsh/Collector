import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import SortableCurationPreview from "../curations/sortableCurationPreview";
import { useMemo } from "react";
import * as Icon from "react-feather";
import { defaultCollectorImageId } from "../../config/settings";
import { displayName } from "../../utils/displayName";

const LandingCurationItem = ({
  curation,
  hoverClass = "group-hover/curationItem:bg-neutral-200 group-hover/curationItem:dark:bg-neutral-800 hover:bg-neutral-200 hover:dark:bg-neutral-800"
}) => { 
  const { banner_image, name } = curation
  const bannerImgId = parseCloudImageId(banner_image)

  const pfpImgId = parseCloudImageId(curation?.curator?.profile_image)


  return (
    <div>
      <Link href={`/curations/${ name }`} >
        <a className="w-full duration-300 relative
        group/curationItem
        "
        >
          <div className="top-0 group-hover/curationItem:-top-1.5  relative shadow shadow-neutral-500/20 rounded-xl overflow-hidden duration-300 pb-[33%]" >
            <CloudinaryImage
              className={clsx("w-full h-full object-cover absolute inset-0", !bannerImgId && "dark:invert")}
              id={bannerImgId || defaultCollectorImageId}
              noLazyLoad
              width={1400}
            />
          </div>
          <h3 className={clsx("font-bold  text-xl text-center mt-2 px-3 w-fit mx-auto rounded-md duration-300", hoverClass)}>
            {name.replaceAll("_", " ")}
          </h3>
        </a>
      </Link>

      <Link href={`/gallery/${ curation.curator?.username }`} >
        <a className={clsx("flex gap-2 items-center justify-center rounded-md px-3 py-1 w-fit mx-auto mt-1", hoverClass)}>
          {curation.curator?.profile_image
            ? (<div className="relative">
              <CloudinaryImage
                className={clsx(
                  "w-6 h-6 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800",
                )}
                id={pfpImgId}
                noLazyLoad
                width={500}
              />
            </div>)
            : null
          }
          <p className="textPalette2">{displayName(curation?.curator)}</p>
        </a>
      </Link>
    </div>
  )
} 

export default LandingCurationItem;