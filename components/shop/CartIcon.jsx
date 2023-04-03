import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import CartContext from "/contexts/cart";
import { ShoppingBagIcon } from "@heroicons/react/outline";

export default function CartIcon({ showCart, showBack }) {
  const router = useRouter();
  const [cart] = useContext(CartContext);
  const [items, setItems] = useState(0);

  useEffect(() => {
    let count = 0;
    for (const c of cart) {
      count += c.qty;
    }
    setItems(count);
  }, [cart]);

  return (
    <div className="absolute right-4 md:right-8 top-3 sm:top-20">
      <div className="inline">
        <ShoppingBagIcon
          className="h-8 w-8 inline cursor-pointer dark:text-white align-middle"
          aria-hidden="true"
        />
        <span className="dark:text-white text-2xl align-middle inline">
          {items}
        </span>
      </div>
      {showCart && items > 0 && (
        <div className="inline ml-4">
          <Link href="/shop/cart" title="">
            <a>
              <button className="inline bg-black text-white dark:bg-white dark:text-black rounded-3xl px-3 py-2 font-bold w-fit cursor-pointer">
                Go to Cart
              </button>
            </a>
          </Link>
        </div>
      )}
      {showBack && (
        <div className="inline ml-4">
          <button
            className="inline bg-greeny text-black rounded-3xl px-3 py-2 font-bold w-fit cursor-pointer"
            onClick={() => router.back()}
          >
            &lt;&lt; Back
          </button>
        </div>
      )}
    </div>
  );
}
