import MainNavigation from "/components/navigation/MainNavigation";
import Cart from "/components/shop/Cart";
import ShopTitle from "/components/shop/ShopTitle";

export default function CartHome() {
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
