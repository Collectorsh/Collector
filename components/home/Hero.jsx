import { useState, useEffect, useCallback } from "react";
import getAllDrops from "/data/drops/getAllDrops";
import UpcomingDrop from "/components/home/UpcomingDrop";
import GalleryImages from "/components/home/GalleryImages";
import CollectorListing from "/components/home/CollectorListing";
import ContentLoader from "react-content-loader";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [drop, setDrop] = useState();
  const [showGalleries, setShowGalleries] = useState(false);
  const [showListing, setShowListing] = useState(false);

  const asyncGetDrop = useCallback(async () => {
    let drops = await getAllDrops();
    if (drops) {
      let d = drops.filter((d) => d.highlight === true)[0];
      if (d) {
        setDrop(d);
      } else {
        // setShowGalleries(true);
        if (Math.round(Math.random() * 2) === 1) {
          setShowGalleries(true);
        } else {
          setShowListing(true);
        }
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    asyncGetDrop();
  }, []);

  return (
    <div className="py-6 sm:py-12 mx-auto dark:text-white">
      <div className="min-h-[100vw] lg:min-h-[520px] xl:min-h-[550px]">
        {loading ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <ContentLoader
                  speed={2}
                  className="w-full h-[100vw] lg:h-[520px] xl:h-[550px] rounded-xl"
                  backgroundColor="#bbbbbb"
                  foregroundColor="#aaaaaa"
                >
                  <rect className="w-full h-[100vw] lg:h-[520px] xl:h-[550px]" />
                </ContentLoader>
              </div>
            </div>
          </>
        ) : (
          <>
            {drop && <UpcomingDrop drop={drop} />}
            {showGalleries && <GalleryImages />}
            {showListing && <CollectorListing />}
          </>
        )}
      </div>
    </div>
  );
}
