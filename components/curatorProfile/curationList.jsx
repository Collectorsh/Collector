import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import SortableCurationPreview from "../curations/sortableCurationPreview";
import { useMemo } from "react";
import * as Icon from "react-feather";
import { defaultCollectorImageId } from "../../config/settings";
import CurationSettingsMenu from "./curationSettingsMenu";

const CurationList = ({ curations, isOwner, asSortable, setCurations }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {asSortable
        ? curations?.map(curation => (
          <SortableCurationPreview key={curation.id} id={curation.id}>
            <CurationListItem key={curation.id} curation={curation} isOwner={isOwner} setCurations={setCurations} />
          </SortableCurationPreview>
        ))
        : curations?.map(curation => (
          <div key={curation.id} className="border-4 border-transparent">
            <CurationListItem  curation={curation} isOwner={isOwner} />
          </div> 
        ))
    }
    </div>
  )
}

export default CurationList;

export const CurationListItem = ({ curation, isOwner, setCurations }) => { 
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
      <a className="w-full duration-300 relative group/curationItem"
      >
        {isOwner && <CurationSettingsMenu curation={curation} setCurations={setCurations} />}
        <PublishedTag
          isPublished={is_published}
          isOwner={isOwner}
          // className="duration-300 group-hover/curationItem:-top-1.5"
        />
        <div className={clsx(
          "top-0 relative shadow shadow-neutral-500/20 rounded-xl overflow-hidden duration-300 pb-[33%]",
          !isOwner && "group-hover/curationItem:-top-1.5"
        )}>
          <CloudinaryImage
            className={clsx("w-full h-full object-cover absolute inset-0", !bannerImgId && "dark:invert")}
            id={bannerImgId || defaultCollectorImageId}
            noLazyLoad
            width={1400}
          />
        </div>
        <h3 className="font-bold collector text-xl text-center my-2 px-3 w-fit mx-auto rounded-md duration-300 group-hover/curationItem:bg-neutral-200 group-hover/curationItem:dark:bg-neutral-800">
          {name.replaceAll("_", " ")}
        </h3>
        {/* <p className="text-sm textPalette3 text-center mb-1">{curationText}</p> */}
      </a>
    </Link>
  )
} 

export const PublishedTag = ({ isPublished, isOwner, className }) => { 
  if (!isOwner) return null
  return (
    <div className={clsx("absolute inset-0 w-full h-full overflow-hidden", className)}>
      <div className={clsx(
        "rounded-md py-0.5 px-4 shadow-md shadow-black/25 dark:shadow-neutral-500/25",
        "absolute top-6 -left-11 z-10 -rotate-45 w-[10rem] text-center",
        isPublished
          ? "bg-emerald-400 dark:bg-emerald-600"
          : "bg-amber-400 dark:bg-amber-600"
      )}>
        <p className="text-sm drop-shadow font-bold">{isPublished ? "Published" : "Draft"}</p>
      </div>
    </div>
  )
}