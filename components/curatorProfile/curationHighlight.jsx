import CloudinaryImage from "../CloudinaryImage";
import Link from "next/link";
import { PublishedTag } from "./curationList";
import { QuillContent } from "../Quill";
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";

const CurationHighlight = ({ curation, isOwner, withCurator }) => { 
  const { banner_image, name, description, description_delta, is_published, curator } = curation
  
  const bannerImgId = parseCloudImageId(banner_image)
  const pfpImgId = parseCloudImageId(curator?.profile_image)

  const descriptionComponent = (
    <div className="px-4 md:px-10 mt-4">
      {description_delta
        ? <QuillContent textDelta={description_delta} />
        : <p className="text-center whitespace-pre-wrap">{description}</p>
      }
    </div>
  )
  
  return (
    <Link href={`/curations/${ name }`} >
      <a className="block w-full my-4">
        <div className="w-full pb-[50%] md:pb-[33%] relative duration-300 hover:scale-[102%] active:scale-100"> 
          <PublishedTag isPublished={is_published} isOwner={isOwner} />
          {banner_image 
            ? (
              <CloudinaryImage
                className=" absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25"
                id={bannerImgId}
                noLazyLoad
                width={2000}
              />

            )
            :
            <div className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25" />
            }
        </div>

        <div className="my-8">
            <h2 className="font-bold text-4xl collector text-center">{name.replaceAll("_", " ")}</h2>
            {withCurator && curator
              ? (<Link href={`/gallery/${ curator.username }`} >
                <a className="flex gap-2 items-center justify-center mt-4 hover:scale-105 duration-300 w-fit mx-auto">
                  <p className="text-lg">Curated by {curator.username}</p>
                  {curator.profile_image
                    ? (<CloudinaryImage
                      className="w-14 h-14 object-cover rounded-full bg-neutral-100 dark:bg-neutral-800"
                      id={pfpImgId}
                      noLazyLoad
                      width={144}
                    />)
                    : null
                  }
                </a>
              </Link>)
            : descriptionComponent
            }
         
        </div>
      </a>
    </Link>
  )
}

export default CurationHighlight;