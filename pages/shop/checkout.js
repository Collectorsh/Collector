import MainNavigation from "/components/navigation/MainNavigation";
import CheckLoggedIn from "/components/CheckLoggedIn";
import Checkout from "/components/shop/Checkout";
import ShopTitle from "/components/shop/ShopTitle";

export default function CheckoutHome() {
  return (
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <div className="relative">
          <ShopTitle />
          <div className="w-full pb-3">
            <Checkout />
          </div>
        </div>
      </div>
    </div>
  );
}
