import React, { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import UserContext from "/contexts/user";
import CartIcon from "/components/shop/CartIcon";
import getProducts from "/data/shop/getProducts";

export default function Shop() {
  const [user] = useContext(UserContext);
  const [products, setProducts] = useState();

  const initGetProducts = useCallback(async () => {
    let res = await getProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    initGetProducts();
  }, []);

  return (
    <div className="mb-12">
      <>
        <div className="absolute right-4 xl:right-0 top-20">
          <CartIcon />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products &&
            products.map((product, index) => (
              <Link href={`/shop/product/${product.uuid}`} title="">
                <a>
                  <div
                    key={index}
                    className="hover:cursor-pointer border-2 p-2 hover:bg-greenlightbg hover:dark:bg-greendarkbg hover:border-greeny hover:dark:border-greeny border-white dark:border-black text-gray-700 dark:text-white hover:dark:text-white"
                  >
                    <div className="min-h-80 aspect-w-1 aspect-h-1 w-full bg-black lg:h-96">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full rounded-md"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-lg">
                          <span aria-hidden="true" className="" />
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-lg font-medium ">
                        ◎{roundToTwo(product.lamports / 1000000000)}{" "}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </>
    </div>
  );
}
