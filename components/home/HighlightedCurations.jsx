import React, { useState, useEffect, useCallback } from "react";
import getHighlightedCurations from "../../data/curation/getHighlightedCurations";
import CurationHighlight from "../curatorProfile/curationHighlight";
import ContentLoader from "react-content-loader";
import CurationList from "../curatorProfile/curationList";

export default function HighlightedCurations({curations}) {

  return (
    <div className="py-10 relative">
      {curations?.length
        ? (
          <>
            <CurationHighlight curation={curations[0]} withCurator />
            <hr className="my-12 border-neutral-200 dark:border-neutral-800" />

            <CurationList curations={curations.slice(1)} withCurator/>
          </>
        )
        : null
      //   : (
      // <div>
      //   <div className="w-full pb-[50%] md:pb-[33%] relative mt-4">
      //     <ContentLoader
      //       speed={2}
      //       className="w-full mb-4 h-full rounded-xl absolute inset-0"
      //       backgroundColor="rgba(120,120,120,0.2)"
      //       foregroundColor="rgba(120,120,120,0.1)"
      //     >
      //       <rect className="w-full h-full" />
      //     </ContentLoader>
      //   </div>
      //   <ContentLoader
      //     speed={2}
      //     className="w-[250px] h-[50px] mt-10 mx-auto"
      //     backgroundColor="rgba(120,120,120,0.2)"
      //     foregroundColor="rgba(120,120,120,0.1)"
      //   >
      //     <rect className="w-full h-[36px]" rx="4" />
      //   </ContentLoader>
      //   <ContentLoader
      //     speed={2}
      //     className="w-[250px] h-[50px] mb-8 mx-auto"
      //     backgroundColor="rgba(120,120,120,0.2)"
      //     foregroundColor="rgba(120,120,120,0.1)"
      //   >
      //     <rect y="13" className="w-[190px] h-[26px]" rx="4" />
      //     <circle cx="225" cy="25" r="24" className="w-[80%]" />
      //   </ContentLoader>
      // </div>
      // )
      }
    </div>
  );
}