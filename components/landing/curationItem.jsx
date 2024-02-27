import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import SortableCurationPreview from "../curations/sortableCurationPreview";
import { useMemo } from "react";
import * as Icon from "react-feather";
import { defaultCollectorImageId } from "../../config/settings";

const LandingCurationItem = ({
  curation,
  hoverClass = "group-hover/curationItem:bg-zinc-200 group-hover/curationItem:dark:bg-zinc-800"
}) => { 
  const { banner_image, name, description_delta, is_published, curation_type } = curation
  const bannerImgId = parseCloudImageId(banner_image)

  const curationText = useMemo(() => {
    switch (curation_type) {
      case "artist": return "an artist curation"
      case "collector": return "a collector curation"
      case "curator": return "a group curation"
    }
  }, [curation_type])

  return (
    <Link href={`/curations/${ name }`} >
      <a className="w-full duration-300 relative
       group/curationItem
      "
      >
        <div className="relative shadow group-hover/curationItem:shadow-md shadow-black/20 rounded-xl overflow-hidden duration-300 pb-[33%]" >
          <CloudinaryImage
            className="w-full h-full object-cover absolute inset-0"//300px
            id={bannerImgId || defaultCollectorImageId}
            noLazyLoad
            width={1400}
          />
        </div>
        <h3 className={clsx("font-bold collector text-xl text-center my-2 px-3 w-fit mx-auto rounded-md duration-300", hoverClass)}>
          {name.replaceAll("_", " ")}
        </h3>
        {/* <p className="text-sm textPalette3 text-center mb-1">{curationText}</p> */}
      </a>
    </Link>
  )
} 

export default LandingCurationItem;