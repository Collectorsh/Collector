import MainNavigation from "/components/navigation/MainNavigation";
import CheckLoggedIn from "/components/CheckLoggedIn";
import Shop from "/components/shop/Shop";
import ShopTitle from "/components/shop/ShopTitle";

export default function ShopHome() {
  return (
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <div className="relative">
          <ShopTitle />
          <div className="w-full pb-3">
            <Shop />
          </div>
        </div>
      </div>
    </div>
  );
}
