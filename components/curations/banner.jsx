import { useEffect, useState } from "react";
import clsx from "clsx"
import EditWrapper from "../curatorProfile/editWrapper"
import CloudinaryImage from "../CloudinaryImage"
import { parseCloudImageId } from "../../utils/cloudinary/idParsing";
import MainButton from "../MainButton";

import * as Icon from 'react-feather'

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
        placement="bottom-4 right-[16px] md:right-[32px] lg:right-[80px] 2xl:bottom-6 2xl:right-[48px]"
        groupHoverClass="group-hover/banner:opacity-100 group-hover/banner:bg-neutral-200 dark:group-hover/banner:bg-neutral-800 group-hover/banner:border-neutral-700 dark:group-hover/banner:border-neutral-300" 
        text="Edit Banner"
        icon={<Icon.Image size={23} strokeWidth={2.5} />}
      >
      <div className="w-full pb-[33%] relative 2xl:rounded-b-2xl shadow-md overflow-hidden">
          {banner ? (
            <CloudinaryImage
              className={clsx(
                "absolute inset-0 w-full h-full object-cover ",
                !bannerLoaded && "animate-pulse",
              )}
              id={bannerImgId}
              noLazyLoad
              onLoad={() => setBannerLoaded(true)}
              width={3000}
            />
          ) : (
            <div className={clsx(
              "absolute inset-0 w-full h-full flex justify-center items-center bg-neutral-200 dark:bg-neutral-800",
            )}>
              <MainButton
                size="lg"
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