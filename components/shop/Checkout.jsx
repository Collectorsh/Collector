import React, { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";
import CartItems from "/components/shop/CartItems";
import { ArrowLeftIcon } from "@heroicons/react/outline";

export default function Checkout() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);

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
      {user && user.token_holder ? (
        <>
          {cart.length > 0 ? (
            <CartItems />
          ) : (
            <p className="dark:text-whitish">Your cart is empty</p>)}
        </>
      ) : (
        <p className="dark:text-whitish">You need to be a signature holder to shop</p>
      )}
    </>
  );
}
