import React, { useEffect, useContext, useState } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";
import CartIcon from "/components/shop/CartIcon";
import { roundToTwo } from "/utils/roundToTwo";
import { QuantityPicker } from "react-qty-picker";
import cloneDeep from "lodash/cloneDeep";

export default function Product({ product }) {
  const [user] = useContext(UserContext);
  const [productAvailable, setProductAvailable] = useState();
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [cart, setCart] = useContext(CartContext);

  useEffect(() => {
    setProductAvailable(true);
  }, [product]);

  useEffect(() => {
    let res = cart.filter((c) => c.product.name === product.name);
    if (res.length === 0) {
      setInCart(false);
    } else {
      let prod = res[0];
      setQuantity(prod.qty);
      setInCart(true);
    }
  }, [cart]);

  const addToCart = (product) => {
    const clonedCart = cloneDeep(cart);
    let res = clonedCart.filter((c) => c.product.name === product.name);
    if (res.length > 0) {
      for (const [index, prod] of clonedCart.entries()) {
        if (prod.product.name === product.name) {
          prod.qty = quantity;
          var foundIndex = index;
        }
      }
      if (quantity === 0) clonedCart.splice(foundIndex);
      setCart(clonedCart);
    } else {
      setCart([...cart, ...[{ qty: quantity, product: product }]]);
    }
  };

  return (
    <>
      <div className="absolute right-4 xl:right-0 top-20">
        <CartIcon />
        <Link href="/shop" title="">
          <a>
            <div className="bg-greeny rounded-3xl px-3 py-3 font-bold w-fit cursor-pointer inline">
              &lt;&lt; Back
            </div>
          </a>
        </Link>
      </div>
      <div className="mb-8"></div>
      {productAvailable && (
        <>
          {productAvailable === true ? (
            <div className="grid sm:grid-cols-6 mx-4 xl:mx-0">
              <div className="sm:col-span-2 bg-black">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full rounded-md"
                />
              </div>
              <div className="sm:col-span-3 sm:col-end-7 text-black dark:text-white">
                <h1 className="text-4xl font-extrabold w-full">
                  {product.name}
                </h1>
                <h2 className="mt-2 text-lg font-normal w-full">
                  {product.description}
                </h2>
                <p className="mt-4 text-lg">
                  ◎{roundToTwo(product.lamports / 1000000000)}{" "}
                </p>
                <div className="my-4">
                  <QuantityPicker
                    min={0}
                    value={quantity}
                    onChange={(value) => {
                      setQuantity(value);
                    }}
                    smooth
                    width="7rem"
                  />
                </div>
                <button
                  className="mt-4 bg-greeny rounded-3xl px-3 py-2 font-bold w-fit cursor-pointer text-black"
                  onClick={() => addToCart(product)}
                >
                  {inCart ? <span>update cart</span> : <span>add to cart</span>}
                </button>
              </div>
            </div>
          ) : (
            <p className="dark:text-whitish">Product not available</p>
          )}
        </>
      )}
    </>
  );
}
