import MainNavigation from "/components/navigation/MainNavigation";
import Shop from "/components/shop/Shop";
import ShopTitle from "/components/shop/ShopTitle";

export default function ShopHome() {
  return (
    <div className="dark:bg-black">
      <MainNavigation />
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <ShopTitle />
          <div className="w-full pb-12">
            <Shop />
          </div>
        </div>
      </div>
    </div>
  );
}
