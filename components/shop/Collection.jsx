import React, { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import UserContext from "/contexts/user";
import CartIcon from "/components/shop/CartIcon";
import getProducts from "/data/shop/getProducts";

export default function Collection({ collection }) {
  const [user] = useContext(UserContext);
  const [products, setProducts] = useState();

  const initGetProducts = useCallback(async (collection) => {
    let res = await getProducts(collection.uuid);
    setProducts(res);
  }, []);

  useEffect(() => {
    initGetProducts(collection);
  }, []);

  return (
    <div className="mb-12">
      <>
        <CartIcon showBack={true} showCart={true} />
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {products &&
            products.map((product, index) => (
              <div
                key={index}
                className="mx-auto hover:cursor-pointer border-2 p-2 hover:bg-greenlightbg hover:dark:bg-greendarkbg hover:border-greeny hover:dark:border-greeny border-white dark:border-black text-gray-700 dark:text-white hover:dark:text-white"
              >
                <div className="w-full sm:w-[300px] h-full sm:h-[350px] bg-white dark:bg-black">
                  <Link
                    href={`/shop/product/${product.uuid}`}
                    title=""
                    key={index}
                  >
                    <a>
                      <img
                        src={eval(product.images)[0]}
                        alt={product.name}
                        className="object-cover object-center rounded-md w-full h-full"
                      />
                    </a>
                  </Link>
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
            ))}
        </div>
      </>
    </div>
  );
}
