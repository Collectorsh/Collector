import Link from "next/link";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";

const GalleryList = ({ galleries, isOwner }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {galleries.map(gallery => (
        <GalleryListItem key={gallery.id} gallery={gallery} isOwner={isOwner} />
      ))}
    </div>
  )
}

export default GalleryList;

const GalleryListItem = ({ gallery, isOwner }) => { 
  const { banner_image, name, description, is_published, } = gallery
  return (
    <Link href={`/pro/${ name }`} >
      <a className="w-full duration-300 hover:scale-[102%] active:scale-100 relative
       group
      "
      >
        <PublishedTag isPublished={is_published} isOwner={isOwner} />
        <div className="relative shadow-lg shadow-black/25 dark:shadow-neutral-500/25 rounded-xl overflow-hidden" >
          <div className="absolute text-center top-0 left-0 p-8 w-full h-full overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50 
          transition-opacity duration-300 opacity-0 group-hover:opacity-100
          backdrop-blur-sm
          ">
            <p
              style={{
                "-webkit-mask-image": "linear-gradient(to bottom, black 60%, transparent 100%)",
                "mask-image": "linear-gradient(to bottom, black 60%, transparent 100%)"
              }}
              className="h-full w-full overflow-hidden whitespace-pre-wrap">{description}</p>
          </div>
          <CloudinaryImage
            className="w-full h-[300px] object-cover "
            id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ banner_image}`}
            noLazyLoad
            width={1400}
          />
        </div>
        <h3 className="font-bold collector text-2xl text-center my-2">{name.replaceAll("_", " ")}</h3>
      </a>
    </Link>
  )
} 

export const PublishedTag = ({ isPublished, isOwner }) => { 
  if (!isOwner) return null
  return (
    <div className={clsx(
      "absolute -top-3 -right-3 z-10",
      "rounded-md py-0.5 px-4 shadow-md shadow-black/25 dark:shadow-neutral-500/25",
      "border border-neutral-200 dark:border-neutral-600",
      isPublished
        ? "bg-emerald-400 dark:bg-emerald-600"
        : "bg-amber-400 dark:bg-amber-600"
    )}>
      <p className="text-sm drop-shadow font-bold">{isPublished ? "Published" : "Draft"}</p>
    </div>
  )
}