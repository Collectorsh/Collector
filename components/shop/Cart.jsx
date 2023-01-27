import React, { useContext } from "react";
import Link from "next/link";
import CartContext from "/contexts/cart";
import Shipping from "/components/shop/cart/Shipping";
import Order from "/components/shop/cart/Order";

export default function Checkout() {
  const [cart] = useContext(CartContext);

  return (
    <>
      <div className="absolute right-0 top-20">
        <Link href="/shop" title="">
          <a>
            <div className="bg-greeny rounded-3xl px-3 py-2 text-black font-bold w-fit cursor-pointer">
              &lt;&lt; Back
            </div>
          </a>
        </Link>
      </div>
      <div className="mb-8"></div>
      {cart.length > 0 ? (
        <div className="grid grid-cols-12">
          <div className="col-span-5">
            <Shipping />
          </div>
          <div className="col-span-6 col-end-13">
            <Order />
          </div>
        </div>
      ) : (
        <p className="dark:text-whitish">Your cart is empty</p>
      )}
    </>
  );
}
