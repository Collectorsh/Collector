import React, { useContext } from "react";
import Link from "next/link";
import CartContext from "/contexts/cart";
import { ShoppingBagIcon } from "@heroicons/react/outline";

export default function Shop() {
  const [cart] = useContext(CartContext);

  const cartItems = () => {
    var count = 0;
    for (const c of cart) {
      count += c.qty;
    }
    return count;
  };

  return (
    <>
      <div className="inline mr-4">
        <ShoppingBagIcon
          className="h-8 w-8 inline cursor-pointer dark:text-white align-middle"
          aria-hidden="true"
        />
        <span className="dark:text-white text-2xl align-middle">
          {cartItems()}
        </span>
      </div>
      {cartItems() > 0 && (
        <Link href="/shop/cart" title="">
          <a>
            <button className="mr-4 bg-black text-white dark:bg-white dark:text-black rounded-3xl px-3 py-2 font-bold w-fit cursor-pointer">
              Go to Cart
            </button>
          </a>
        </Link>
      )}
    </>
  );
}
