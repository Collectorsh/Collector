import React, { useEffect, useState, useContext } from "react";
import UserContext from "/contexts/user";
import CartContext from "/contexts/cart";
import { roundToTwo } from "/utils/roundToTwo";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import LoadingModal from "/components/LoadingModal";
import {
  SystemProgram,
  Transaction,
  PublicKey,
  Connection,
} from "@solana/web3.js";
import { toPublicKey } from "/config/settings";
import verifyPurchase from "/data/shop/verifyPurchase";
import { TrashIcon } from "@heroicons/react/outline";

export default function Order() {
  const [user] = useContext(UserContext);
  const [cart, setCart] = useContext(CartContext);
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [transactionComplete, setTransactionComplete] = useState();
  const [orderNumber, setOrderNumber] = useState();
  const [isError, setIsError] = useState();

  useEffect(() => {
    const ttl = 0;
    for (const i of cart) {
      ttl += i.product.lamports * i.qty;
    }
    setTotal(ttl);
  }, [cart]);

  const validateForm = async () => {
    setIsError();

    const firstname = document.getElementById("first-name").value;
    if (firstname === undefined || firstname === null || firstname === "") {
      setIsError("first-name");
      return { error: true };
    }
    const lastname = document.getElementById("last-name").value;
    if (lastname === undefined || lastname === null || lastname === "") {
      setIsError("last-name");
      return { error: true };
    }
    const email = document.getElementById("email-address").value;
    if (email === undefined || email === null || email === "") {
      setIsError("email-address");
      return { error: true };
    }
    const country = document.getElementById("country").value;
    if (country === undefined || country === null || country === "") {
      setIsError("country");
      return { error: true };
    }
    const street = document.getElementById("street-address").value;
    if (street === undefined || street === null || street === "") {
      setIsError("street-address");
      return { error: true };
    }
    const city = document.getElementById("city").value;
    if (city === undefined || city === null || city === "") {
      setIsError("city");
      return { error: true };
    }
    const region = document.getElementById("region").value;
    if (region === undefined || region === null || region === "") {
      setIsError("region");
      return { error: true };
    }
    const post = document.getElementById("postal-code").value;
    if (post === undefined || post === null || post === "") {
      setIsError("postal-code");
      return { error: true };
    }
    const address = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      country: country,
      street: street,
      city: city,
      region: region,
      postcode: post,
    };
    return { error: false, address: address };
  };

  const payNow = async () => {
    const form = await validateForm();
    if (form.error) return;

    if (!publicKey) {
      try {
        setVisible(true);
      } catch (err) {
        error("Please connect your wallet");
      }
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toPublicKey),
          lamports: total,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      setLoading(true);

      const items = [];

      for (const c of cart) {
        items.push({ id: c.product.id, qty: c.qty, size: c.size });
      }

      const res = await verifyPurchase(
        user.api_key,
        total,
        signature,
        publicKey,
        items,
        form.address
      );

      setLoading(false);

      if (res.status === "success") {
        success("Thank you for your purchase!");
        setTransactionComplete(true);
        setOrderNumber(res.order_number);
      } else {
        error(res.msg);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      error("Transaction failed");
      return;
    }
  };

  const removeFromCart = async (id) => {
    const newCart = cart.filter(function (c) {
      return c.id !== id;
    });
    setCart(newCart);
  };

  return (
    <div className="mt-14 sm:mt-0">
      <Toaster />
      <div className="overflow-hidden shadow sm:rounded-md">
        {transactionComplete ? (
          <div className="dark:bg-dark1 dark:text-white px-4 py-5 sm:p-6">
            <h2 className="text-3xl font-extrabold mb-4 w-full">Thank You!</h2>
            <p className="text-2xl mt-6">
              Order Number: {orderNumber && orderNumber}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12">
            <div className="col-span-5">
              <div className="mt-14 sm:mt-0">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="dark:bg-dark1 dark:text-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "first-name" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "last-name" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium"
                        >
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email-address"
                          id="email-address"
                          autoComplete="email"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "email-address" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium"
                        >
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-dark3 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "country" &&
                            "border border-red-500"
                          }`}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium"
                        >
                          Street address
                        </label>
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "street-address" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="address-level2"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "city" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="region"
                          className="block text-sm font-medium"
                        >
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="region"
                          id="region"
                          autoComplete="address-level1"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "region" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="postal-code"
                          className="block text-sm font-medium"
                        >
                          ZIP / Postal code
                        </label>
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            isError &&
                            isError === "postal-code" &&
                            "border border-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 col-end-13">
              <div className="dark:bg-dark1 dark:text-white px-4 py-5 sm:p-6">
                <h2 className="text-4xl font-extrabold mb-4 w-full">
                  Your Order
                </h2>
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="my-3 border-t border-b border-gray-100 dark:border-dark3 py-2"
                  >
                    <TrashIcon
                      className="h-4 w-4 inline cursor-pointer text-red-400 float-right"
                      aria-hidden="true"
                      onClick={() => removeFromCart(item.id)}
                    />
                    <p className="mb-2 font-bold">{item.product.name}</p>
                    <div className="mb-2 dark:text-white">
                      <label>size: </label>
                      <span className="">{item.size}</span>
                    </div>
                    <div className="dark:text-white">
                      <label>qty: </label>
                      <span className="">{item.qty}</span>
                    </div>
                  </div>
                ))}
                {total && (
                  <>
                    <h2 className="py-2 text-2xl font-extrabold my-5 w-full border-t border-b border-gray-100 dark:border-dark3">
                      TOTAL
                      <span className="float-right text-2xl">
                        ◎{roundToTwo(total / 1000000000)}
                      </span>
                    </h2>
                    <button
                      onClick={payNow}
                      className="uppercase text-center text-sm mt-5 xl:px-24 px-12 sm:px-16 py-2 rounded-md font-bold bg-greeny text-black mx-auto w-full"
                    >
                      PAY NOW
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <LoadingModal
        open={loading}
        title="Confirming Transaction"
        content="Please don't close your browser"
        icon="chip"
      />
    </div>
  );
}
