import React, { useContext } from "react";
import Link from "next/link";
import CartContext from "/contexts/cart";
import Order from "/components/shop/cart/Order";
import CartIcon from "/components/shop/CartIcon";

export default function Checkout() {
  const [cart] = useContext(CartContext);

  return (
    <>
      <CartIcon showBack={true} showCart={false} />
      <div className="mb-8"></div>
      {cart.length > 0 ? (
        <Order />
      ) : (
        <p className="dark:text-whitish">Your cart is empty</p>
      )}
    </>
  );
}
