import { useRouter } from "next/router";
import MainNavigation from "/components/navigation/MainNavigation";
import Cart from "/components/shop/Cart";
import ShopTitle from "/components/shop/ShopTitle";
import { useEffect } from "react";

export default function CartHome() {
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
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 relative">
        <ShopTitle />
        <div className="w-full pb-3">
          <Cart />
        </div>
      </div>
    </div>
  );
}
