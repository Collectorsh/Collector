import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";

export const curationListPlaceholderId = "global/Collector_Hero_btrh4t"

const CurationList = ({ curations, isOwner, withCurator }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {curations?.map(curation => (
        <CurationListItem key={curation.id} curation={curation} isOwner={isOwner} withCurator={withCurator} />
      ))}
    </div>
  )
}

export default CurationList;

const CurationListItem = ({ curation, isOwner, withCurator }) => { 
  const { banner_image, name, description, is_published, curator } = curation
  const bannerImgId = parseCloudImageId(banner_image)
  return (
    <Link href={`/curations/${ name }`} >
      <a className="w-full duration-300 hover:scale-[102%] active:scale-100 relative
       group
      "
      >
        <PublishedTag isPublished={is_published} isOwner={isOwner} />
        <div className="relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden" >
          <CloudinaryImage
            className="w-full h-[300px] object-cover "
            id={bannerImgId || curationListPlaceholderId}
            noLazyLoad
            width={1400}
          />
        </div>
        <h3 className="font-bold collector text-2xl text-center my-2">
          {name.replaceAll("_", " ")}
        
        </h3>
          {withCurator && curator ? (
            <p className="text-center"> Curated by {curator.username}</p>
            ): null}
      </a>
    </Link>
  )
} 

export const PublishedTag = ({ isPublished, isOwner }) => { 
  if (!isOwner) return null
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className={clsx(
        "rounded-md py-0.5 px-4 shadow-md shadow-black/25 dark:shadow-neutral-500/25",
        "absolute top-6 -right-11 z-10 rotate-45 w-[10rem] text-center",
        isPublished
          ? "bg-emerald-400 dark:bg-emerald-600"
          : "bg-amber-400 dark:bg-amber-600"
      )}>
        <p className="text-sm drop-shadow font-bold">{isPublished ? "Published" : "Draft"}</p>
      </div>
    </div>
  )
}