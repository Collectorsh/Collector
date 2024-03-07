import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import SortableCurationPreview from "../curations/sortableCurationPreview";
import { useMemo, useState } from "react";
import * as Icon from "react-feather";
import { defaultCollectorImageId } from "../../config/settings";
import { displayName } from "../../utils/displayName";
import ContentLoader from "react-content-loader";

const LandingCurationItem = ({
  curation,
  hoverClass = "group-hover/curationItem:bg-neutral-200 group-hover/curationItem:dark:bg-neutral-800 hover:bg-neutral-200 hover:dark:bg-neutral-800"
}) => { 
  const { banner_image, name } = curation
  // const bannerImgId = parseCloudImageId(banner_image)
  const [bannerImgId, setBannerImgId] = useState(parseCloudImageId(banner_image) || defaultCollectorImageId);

  const pfpImgId = parseCloudImageId(curation?.curator?.profile_image)


  const handleError = () => {
    setBannerImgId(defaultCollectorImageId)
  }

  return (
    <div>
      <Link href={`/${ curation?.curator?.username || "curations"}/${ name }`} >
        <a className="w-full duration-300 relative
        group/curationItem
        "
        >
          <div className="top-0 group-hover/curationItem:-top-1.5  relative shadow shadow-neutral-500/20 rounded-xl overflow-hidden duration-300 pb-[33%]" >
            <CloudinaryImage
              className={clsx("w-full h-full object-cover absolute inset-0", !bannerImgId && "dark:invert")}
              id={bannerImgId}
              noLazyLoad
              width={1400}
              onError={handleError}
            />
          </div>
          <h3 className={clsx("font-bold  text-xl text-center mt-2 px-3 w-fit mx-auto rounded-md duration-300", hoverClass)}>
            {name.replaceAll("_", " ")}
          </h3>
        </a>
      </Link>

      <Link href={`/${ curation.curator?.username }`} >
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

export const LandingCurationItemPlaceholder = () => {
  return (
    <div>
        <div className="w-full relative">
          <div className="top-0 group-hover/curationItem:-top-1.5  relative shadow shadow-neutral-500/20 rounded-xl overflow-hidden pb-[33%]" >
          <ContentLoader
              title=""
              speed={2}
              className="w-full h-full rounded-lg absolute inset-0"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
            >
              <rect className="w-full h-full" />
            </ContentLoader>
          </div>
          <div className={clsx("font-bold h-7 w-24 text-center mt-2 mx-auto rounded-md")}>
            <ContentLoader
              title=""
              speed={2}
              className="w-full h-full rounded-lg"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
            >
              <rect className="w-full h-full" />
            </ContentLoader>
          </div>
        </div>

      <div>
        <div className={clsx("flex gap-2 items-center justify-center rounded-md w-fit mx-auto mt-1")}>
          <div className="w-6 h-6 object-cover rounded-full">
            <ContentLoader
              title=""
              speed={2}
              className="w-full h-full rounded-full"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
            >
              <rect className="w-full h-full rounded-full" />
            </ContentLoader>
          </div>
          <div className="h-4 w-14">
            <ContentLoader
              title=""
              speed={2}
              className="w-full h-full rounded-md"
              backgroundColor="rgba(120,120,120,0.2)"
              foregroundColor="rgba(120,120,120,0.1)"
            >
              <rect className="w-full h-full" />
            </ContentLoader>
          </div>
        </div>
      </div>
    </div>
)
}