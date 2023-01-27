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

export default function Order() {
  const [user] = useContext(UserContext);
  const [cart] = useContext(CartContext);
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC);
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [transactionComplete, setTransactionComplete] = useState();
  const [orderNumber, setOrderNumber] = useState();

  useEffect(() => {
    const ttl = 0;
    for (const i of cart) {
      ttl += i.product.lamports * i.qty;
    }
    setTotal(ttl);
  }, [cart]);

  const payNow = async () => {
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

      // await connection.confirmTransaction(signature, "confirmed");

      const res = await verifyPurchase(
        user.api_key,
        total,
        signature,
        publicKey,
        cart
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
          <div className="dark:bg-dark1 dark:text-white px-4 py-5 sm:p-6">
            <h2 className="text-4xl font-extrabold mb-4 w-full">Your Order</h2>
            <div className="grid grid-cols-6 gap-6">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="col-span-6 sm:col-span-3 my-3 border-t border-b border-gray-100 dark:border-dark3 py-2"
                >
                  <p className="mb-2 font-bold">{item.product.name}</p>
                  <div className="dark:text-white inline">
                    <label>qty: </label>
                    <span className="">{item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
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
