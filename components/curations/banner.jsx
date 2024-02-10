import { useEffect, useState } from "react";
import clsx from "clsx"
import EditWrapper from "../curatorProfile/editWrapper"
import CloudinaryImage from "../CloudinaryImage"
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import MainButton from "../MainButton";

import * as Icon from 'react-feather'
import { curationListPlaceholderId } from "../curatorProfile/curationList";


const CurationBanner = ({ setEditBannerOpen, displayDraftEdit, banner, useDraftContent, publishedBanner}) => {
  const [bannerLoaded, setBannerLoaded] = useState(true);
  const bannerImgId = parseCloudImageId(banner)

  useEffect(() => {
    if (!useDraftContent || !publishedBanner || !banner) return;
    //set loaded to false when the banner changes
    if (banner !== publishedBanner) setBannerLoaded(false);
  }, [banner, publishedBanner, useDraftContent])

  return (
    <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 group/banner">
      <EditWrapper
        isOwner={banner && displayDraftEdit}
        onEdit={() => setEditBannerOpen(true)}
        placement="bottom-4 right-9 lg:right-[76px] 2xl:bottom-6 2xl:right-[44px]"
        groupHoverClass="group-hover/banner:opacity-100"
        text="Edit Banner"
        icon={<Icon.Image size={20} strokeWidth={2.5} />}
      >
      <div className="w-full pb-[50%] md:pb-[33%] relative 2xl:rounded-b-2xl shadow-black/20 shadow-md overflow-hidden">
          {banner ? (
            <CloudinaryImage
              className={clsx(
                "absolute inset-0 w-full h-full object-cover ",
                !bannerLoaded && "animate-pulse"
              )}
              id={bannerImgId}
              noLazyLoad
              onLoad={() => setBannerLoaded(true)}
              width={3000}
            />
          ) : (
            <div className={clsx(
              "absolute inset-0 w-full h-full flex justify-center items-center bg-zinc-200 dark:bg-zinc-800",
            )}>
                <MainButton
                size="xl"
                onClick={() => setEditBannerOpen(true)}
                className={clsx("flex items-center gap-2", !displayDraftEdit && "hidden")}
              >
                Add Banner
                <Icon.Plus strokeWidth={2.5}/>
              </MainButton>
            </div>
          )}

      </div>
        </EditWrapper>
    </div>
  )
}

export default CurationBanner