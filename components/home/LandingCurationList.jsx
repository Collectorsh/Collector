import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import { useMemo } from "react";

const LandingCurationList = ({ curations }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {curations?.map(curation => <LandingCurationListItem key={curation.id} curation={curation} />)}
    </div>
  )
}

export default LandingCurationList;

const LandingCurationListItem = ({ curation }) => { 
  const { banner_image, name, description, is_published, curator } = curation
  const bannerImgId = parseCloudImageId(banner_image)

  const curationTypeText = useMemo(() => {
    switch (curation.curation_type) {
      case "curator":
        return "Curated by"
      case "artist":
        return "Art by"
      case "collector":
        return "Collection by"
    }
  }, [curation.curation_type])

  return (
    <Link href={`/${ curation?.curator?.username || "curations"}/${ name }`} legacyBehavior>
      <a className="w-full duration-300 hover:scale-[102%] active:scale-100 relative
       group
      "
      >
        <div className="relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden" >
          <CloudinaryImage
            className="w-full h-[300px] object-cover "
            id={bannerImgId || defaultCollectorImageId}
            noLazyLoad
            width={1400}
          />
        </div>
        <h3 className="font-bold collector text-2xl text-center my-2">
          {name.replaceAll("_", " ")}
        </h3>
        {curator
          ? <p className="text-center">{curationTypeText} {curator.username}</p>
          : null
        }
      </a>
    </Link>
  )
} 