import MainNavigation from "/components/navigation/MainNavigation";
import Shop from "/components/shop/Shop";
import ShopTitle from "/components/shop/ShopTitle";

export default function ShopHome() {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        <ShopTitle />
        <div className="w-full pb-12">
          <Shop />
        </div>
      </div>
    </div>
  );
}
