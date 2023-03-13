import React, { useEffect, useContext, useState } from "react";
import Link from "next/link";
import CartContext from "/contexts/cart";
import CartIcon from "/components/shop/CartIcon";
import { roundToTwo } from "/utils/roundToTwo";
import Slider from "react-slick";

export default function Product({ product }) {
  const [productAvailable, setProductAvailable] = useState();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(eval(product.sizes)[0]);
  const [cart, setCart] = useContext(CartContext);

  useEffect(() => {
    setProductAvailable(true);
  }, [product]);

  const addToCart = (product) => {
    const newCart = [
      ...cart,
      ...[
        {
          qty: Number(quantity),
          size: size,
          product: product,
          id: Math.random().toString(36).slice(2, 7),
        },
      ],
    ];
    setCart(newCart);
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className="absolute right-2 sm:right-4 xl:right-0 top-3 sm:top-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-6 mx-4 xl:mx-0 mb-6">
              <div className="col-span-1 sm:col-span-2 bg-white dark:bg-black">
                <div className="text-center">
                  <Slider {...settings}>
                    {eval(product.images).map((image, index) => (
                      <>
                        <div
                          key={index}
                          className="overflow-hidden col-span-2 relative -mt-2"
                        >
                          <img
                            src={`https://cdn.collector.sh/${image}`}
                            alt=""
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full rounded-md"
                          />
                        </div>
                      </>
                    ))}
                  </Slider>
                </div>
              </div>
              <div className="col-span-1 sm:col-span-3 sm:col-end-7 text-black dark:text-white">
                <h1 className="mt-8 sm:mt-0 text-4xl font-extrabold w-full">
                  {product.name}
                </h1>
                <h2 className="mt-2 text-lg font-normal w-full whitespace-pre-line pb-6 border-b border-gray-100 dark:border-dark3">
                  {product.description}
                </h2>
                <p className="mt-10 text-lg">
                  ◎{roundToTwo(product.lamports / 1000000000)}{" "}
                </p>
                <div className="mt-4 grid grid-cols-2">
                  <div>
                    <span className="text-lg">Quantity: </span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      id="qty"
                      name="qty"
                      className="p-2 inline w-[100px] rounded-md border border-gray-300 dark:border-dark3 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <span className="text-lg">Size: </span>
                  </div>
                  <div className="mt-4">
                    <select
                      id="size"
                      name="size"
                      className="p-2 inline w-fit rounded-md border border-gray-300 dark:border-dark3 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setSize(e.target.value)}
                    >
                      {eval(product.sizes).map((size, index) => (
                        <option key={index}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className="mt-4 bg-greeny rounded-3xl px-3 py-2 font-bold w-fit cursor-pointer text-black"
                  onClick={() => addToCart(product)}
                >
                  <span>add to cart</span>
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