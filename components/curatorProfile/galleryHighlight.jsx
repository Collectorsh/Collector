import CloudinaryImage from "../CloudinaryImage";
import Link from "next/link";
import { PublishedTag } from "./galleryList";

const GalleryHighlight = ({ gallery, isOwner }) => { 
  const { banner_image, name, description, is_published } = gallery

  return (
    <Link href={`/pro/${ name }`} >
      <a className="block w-full my-4 duration-300 hover:scale-[102%] active:scale-100 ">
        <div className="w-full pb-[50%] md:pb-[33%] relative"> 
          <PublishedTag isPublished={is_published} isOwner={isOwner}/>
          <CloudinaryImage
            className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg shadow-black/25 dark:shadow-neutral-500/25"
            id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ banner_image}`}
            noLazyLoad
            width={2000}
          />
        </div>

        <div className="my-12">
          <h2 className="font-bold text-4xl collector mb-8 text-center">{name.replaceAll("_", " ")}</h2>
          <p className="text-center px-4 md:px-10 whitespace-pre-wrap">{description}</p>
        </div>
      </a>
    </Link>
  )
}

export default GalleryHighlight;