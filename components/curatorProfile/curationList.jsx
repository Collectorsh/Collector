import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import SortableCurationPreview from "../curations/sortableCurationPreview";
import { useMemo } from "react";
import * as Icon from "react-feather";
import { defaultCollectorImageId } from "../../config/settings";
import dynamic from 'next/dynamic';

const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const CurationList = ({ curations, isOwner, asSortable }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {asSortable
        ? curations?.map(curation => (
          <SortableCurationPreview key={curation.id} id={curation.id}>
            <CurationListItem key={curation.id} curation={curation} isOwner={isOwner} />
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

export const CurationListItem = ({ curation, isOwner }) => { 
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
        <PublishedTag isPublished={is_published} isOwner={isOwner} />
        <div className="relative shadow group-hover/curationItem:shadow-md shadow-black/20 rounded-xl overflow-hidden duration-300 " >
          <CloudinaryImage
            className="w-full h-[300px] object-cover "
            id={bannerImgId || defaultCollectorImageId}
            noLazyLoad
            width={1400}
          />
          <div className="opacity-0 group-hover/curationItem:opacity-100 duration-300 absolute inset-0 bg-zinc-200/75 dark:bg-zinc-800/75 backdrop-blur-sm p-4 h-full overflow-y-auto cursor-pointer">
            {description_delta && <QuillContent textDelta={description_delta} />} 
          </div>
        </div>
        <h3 className="font-bold collector text-2xl text-center my-2 px-3 w-fit mx-auto rounded-md duration-300 group-hover/curationItem:bg-zinc-200 group-hover/curationItem:dark:bg-zinc-800">
          {name.replaceAll("_", " ")}
        </h3>
        {/* <p className="text-sm textPalette3 text-center mb-1">{curationText}</p> */}
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