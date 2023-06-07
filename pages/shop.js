import { useRouter } from "next/router";
import MainNavigation from "/components/navigation/MainNavigation";
import Collections from "/components/shop/Collections";
import ShopTitle from "/components/shop/ShopTitle";
import { useEffect } from "react";

export default function ShopHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/")
  }, [router])

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1>404</h1>
    </div>
  )
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      {/* <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        <ShopTitle />
        <div className="w-full pb-12">
          <Collections />
        </div>
      </div> */}
    </div>
  );
}
