import React, { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";

export default function Checkout() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);

  return (
    <>
      {user && user.token_holder ? (
        <>{cart.length > 0 ? <p>ok</p> : <p>Your cart is empty</p>}</>
      ) : (
        <p>You need to be a signature holder to shop</p>
      )}
    </>
  );
}
