import CloudinaryImage from "../CloudinaryImage";
import Link from "next/link";
import { PublishedTag } from "./curationList";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";

import dynamic from 'next/dynamic';
import { useMemo } from "react";
import { defaultCollectorImageId } from "../../config/settings";
const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })


const CurationHighlight = ({ curation, isOwner, withCurator }) => { 
  const { banner_image, name, description, description_delta, is_published, curation_type } = curation
  
  const bannerImgId = parseCloudImageId(banner_image)


  const curationText = useMemo(() => {
    switch (curation_type) {
      case "artist": return "an artist curation"
      case "collector": return "a collector curation"
      case "curator": return "a group curation"
    }
  }, [curation_type])
  return (
    <>
      <Link href={`/curations/${ name }`} >
        <a className="block w-full group/curationItem">
          <div className="w-full pb-[50%] md:pb-[33%] relative duration-300 rounded-xl overflow-hidden shadow-black/20 shadow-md group-hover/curationItem:-translate-y-2"> 
            <PublishedTag isPublished={is_published} isOwner={isOwner} />

            <CloudinaryImage
              className=" absolute inset-0 w-full h-full object-cover"
              id={bannerImgId || defaultCollectorImageId}
              noLazyLoad
              width={2000}
            />
          </div>
          <h2
            className="mt-4 font-bold text-4xl collector text-center px-3 w-fit mx-auto rounded-md duration-300 group-hover/curationItem:bg-zinc-200 group-hover/curationItem:dark:bg-zinc-800"
          >
            {name.replaceAll("_", " ")}
          </h2>
          {/* <p className="text-sm textPalette3 text-center">{curationText}</p> */}
        </a>
      </Link>
      <div className="px-4 md:px-10 mt-6 mb-8">
        {description_delta
          ? <QuillContent textDelta={description_delta} />
          : <p className="text-center whitespace-pre-wrap">{description}</p>
        }
      </div>   
    </>
  )
}

export default CurationHighlight;