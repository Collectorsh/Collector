import CloudinaryImage from "../CloudinaryImage";
import Link from "next/link";
import { PublishedTag } from "./curationList";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";

import dynamic from 'next/dynamic';
import { useMemo, useState } from "react";
import { defaultCollectorImageId } from "../../config/settings";
import clsx from "clsx";
import CurationSettingsMenu from "./curationSettingsMenu";
const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })


const CurationHighlight = ({ curation, isOwner, setCurations }) => { 
  const { banner_image, name, description, description_delta, is_published, curation_type } = curation
  
  const [bannerImgId, setBannerImgId] = useState(parseCloudImageId(banner_image) || defaultCollectorImageId);
  const usingDefault = bannerImgId === defaultCollectorImageId

  const handleError = () => {
    setBannerImgId(defaultCollectorImageId)
  }


  return (
    <>
      <Link href={`/${curation?.curator?.username || "curations"}/${ name }`} legacyBehavior>
        <a className="block w-full group/curationItem">
          {isOwner && <CurationSettingsMenu curation={curation} setCurations={setCurations} />}
          <div className={clsx(
            "w-full pb-[33%] relative duration-300 rounded-xl overflow-hidden shadow-neutral-500/20 shadow-md ",
            !isOwner && "group-hover/curationItem:-translate-y-2"
          )}> 
            <PublishedTag isPublished={is_published} isOwner={isOwner} />

            <CloudinaryImage
              className={clsx(" absolute inset-0 w-full h-full object-cover", usingDefault && "dark:invert")}
              id={bannerImgId}
              noLazyLoad
              width={2000}
              onError={handleError}
            />
          </div>
          <h2
            className="mt-4 font-bold text-4xl collector text-center px-3 w-fit mx-auto rounded-md duration-300 group-hover/curationItem:bg-neutral-200 group-hover/curationItem:dark:bg-neutral-800"
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