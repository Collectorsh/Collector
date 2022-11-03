import React, { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";
import getProducts from "/data/shop/getProducts";
import { ShoppingBagIcon } from "@heroicons/react/outline";

export default function Shop() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);
  const [products, setProducts] = useState();

  const initGetProducts = useCallback(async () => {
    let res = await getProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    initGetProducts();
  }, []);

  const addToCart = (e, product) => {
    const qty = document.getElementById(`${product.name}-qty`).value;
    setCart([...cart, ...[{ qty: qty, product: product }]]);
  };

  return (
    <div className="mb-12">
      {user && user.token_holder ? (
        <>
          <div className="absolute right-0 top-20">
            <ShoppingBagIcon
              className="h-8 w-8 inline cursor-pointer dark:text-white"
              aria-hidden="true"
            />
            <span className="dark:text-white">{cart.length}</span>
            {cart.length > 0 && (
              <Link href="/shop/checkout" title="">
                <a>
                  <button className="ml-4 bg-greeny rounded-3xl px-3 py-2 text-black font-bold w-fit cursor-pointer">
                    Checkout
                  </button>
                </a>
              </Link>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products &&
              products.map((product, index) => (
                <div key={index} className="">
                  <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700 dark:text-white">
                        <span aria-hidden="true" className="" />
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-whitish">
                        {product.color}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ◎ {product.sol}{" "}
                      <span className="text-gray-300 dark:text-gray-600">
                        (${product.usd})
                      </span>
                    </p>
                  </div>
                  <button
                    className="bg-greeny rounded-3xl px-3 py-2 text-black font-bold w-fit cursor-pointer mt-2"
                    onClick={(e) => addToCart(e, product)}
                  >
                    add to cart
                  </button>
                  <div className="dark:text-white inline ml-2">
                    <label>qty: </label>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-12 focus:outline-none focus:shadow-outline"
                      id={`${product.name}-qty`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p className="dark:text-whitish">You need to be a signature holder to shop</p>
      )}
    </div>
  );
}
