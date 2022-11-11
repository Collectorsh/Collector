import React, { useContext } from "react";
import CartContext from "/contexts/cart";

export default function Order() {
  const [cart] = useContext(CartContext);

  return (
    <div className="mt-14 sm:mt-0">
      <div className="overflow-hidden shadow sm:rounded-md">
        <div className="bg-white px-4 py-5 sm:p-6">
          <h1 className="text-4xl font-extrabold text-black w-full">
            Your Order
          </h1>
          <div className="grid grid-cols-6 gap-6">
            {cart.map((item, index) => (
              <div key={index} className="col-span-6 sm:col-span-3">
                <p>{item.product.name}</p>
                <div className="dark:text-white inline">
                  <label>qty: </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue={item.qty}
                    className="w-12 focus:outline-none focus:shadow-outline"
                    id={`${item.product.name}-qty`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
