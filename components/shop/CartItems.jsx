import React, { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";

export default function CartItems() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);

  return (
    <>
      {cart.map((item, index) => (
        <>
          <p>{item.product.name}</p>
          <div className="dark:text-white inline">
            <label>qty: </label>
            <input
              type="number"
              min="1"
              defaultValue={ item.qty }
              className="w-12 focus:outline-none focus:shadow-outline"
              id={`${item.product.name}-qty`}
            />
          </div>
        </>
      ))}
    </>
  );
}
