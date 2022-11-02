import Head from "next/head";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/solid";
import MainNavigation from "/components/navigation/MainNavigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import React, { useState, useContext } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import verifyPurchase from "/data/store/verifyPurchase";
import LoadingModal from "/components/LoadingModal";
import Moment from "react-moment";
import { toPublicKey, monthlyCharge, yearlyCharge } from "/config/settings";

export default function Payment() {
  const [user, setUser] = useContext(UserContext);
  const { connection } = useConnection("mainnet-beta");
  const { publicKey, sendTransaction } = useWallet();
  const [monthly, setMonthly] = useState(false);
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    if (!publicKey) {
      error("Please connect your wallet");
      return;
    }

    if (!user) {
      error("Please sign in");
      return;
    }

    try {
      const amount = monthly === true ? monthlyCharge : yearlyCharge;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toPublicKey),
          lamports: amount,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      setLoading(true);

      // await connection.confirmTransaction(signature, "confirmed");

      const res = await verifyPurchase(
        user.api_key,
        amount,
        monthly === true ? "month" : "year",
        signature,
        publicKey
      );

      setLoading(false);

      if (res.status === "success") {
        success("Thank you for your purchase!");
        setUser(res.user);
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

  function updateDuration(e) {
    setMonthly(e.target.checked);
  }

  return (
    <div className="min-h-screen dark:bg-dark1">
      <Toaster />
      <Head>
        <title>Collector</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <MainNavigation />
      <div className="mx-auto px-2 md:px-4 lg:px-12">
        <div className="mx-auto px-2 md:px-0">
          <header className="flex flex-col items-center mb-2">
            <h1 className="text-base text-3xl font-semibold pt-4 leading-4 w-fit px-3 rounded-lg dark:text-gray-100">
              Our Plans &amp; Pricing
            </h1>
            <div className="pt-8 w-3/5 lg:w-1/5 flex justify-around ">
              <p className="text-sm text-gray-500 font-bold">Annually</p>
              <div className="">
                <label
                  htmlFor="border"
                  className="flex items-center cursor-pointer relative mb-4"
                >
                  <input
                    type="checkbox"
                    id="border"
                    className="sr-only"
                    onChange={(e) => updateDuration(e)}
                  />
                  <div className="toggle-bg bg-burple border-2 border-burple h-6 w-11 rounded-full"></div>
                </label>
              </div>
              <p className="text-sm text-gray-500 font-bold">Monthly</p>
            </div>
          </header>
          <section className="grid grid-cols-1 gap-x-20 lg:grid-cols-3 justify-items-center w-full w-full lg:px-10 py-12">
            <article className="w-full xl:w-[350px] bg-white w-full mb-10 lg:px-4 px-6 py-10 text-left text-primary-dark rounded-lg dark:bg-dark3 dark:text-gray-100">
              <h5 className="font-bold text-base mb-3">Starter</h5>
              <h2 className="pb-4 flex justify-start font-bold border-b border-gray-300">
                <span className="text-2xl mt-4 mr-1">◎</span>
                <span className="text-5xl"> 0</span>
              </h2>
              <ul className="text-sm font-bold">
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Unique Profile
                </li>
                <li className="pt-3 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Gallery Curation
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Downdload Collage
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Exchange Art Offers
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Tag as Accepting Offers
                </li>
              </ul>
              <button className="uppercase text-sm mt-12 xl:px-24 px-12 sm:px-16 py-2 font-bold text-primary-very-light rounded-md bg-gray-200 text-black w-full cursor-auto">
                GET STARTED
              </button>
            </article>
            <article className="w-full xl:w-[350px] mb-10 px-6 py-16 lg:-mt-6 text-white text-left rounded-lg bg-burpledark">
              <h5 className="font-bold text-base mb-3">Premium</h5>
              <h2 className="font-bold pb-4 mt-2 border-b border-gray-100 flex justify-start">
                <span className="text-2xl mt-4 mr-1">◎</span>
                <span className="text-5xl ">
                  {" "}
                  {monthly === true
                    ? monthlyCharge / 1000000000
                    : yearlyCharge / 1000000000}
                </span>
                <span className="text-2xl mt-3 ml-2">
                  {monthly === true ? "/ month" : "/ year"}
                </span>
              </h2>
              <ul className=" text-sm font-bold">
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  All the features of FREE
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Bid Tracking
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Estimated Value
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Follow Artists
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Auction Notifications
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Auction Watchlist
                </li>
                <span>
                  * Includes data from Holaplex, Exchange Art and Formfunction
                </span>
              </ul>
              <button
                onClick={payNow}
                className="uppercase text-center text-sm mt-10 xl:px-24 px-12 sm:px-16 py-2 rounded-md font-bold bg-burple mx-auto w-full"
              >
                {user &&
                user.pro &&
                user.subscription_end &&
                user.subscription_end &&
                new Date(user.subscription_end).getTime() > Date.now()
                  ? "EXTEND"
                  : "BUY NOW"}
              </button>
              {user &&
                user.pro &&
                user.subscription_end &&
                new Date(user.subscription_end).getTime() > Date.now() && (
                  <>
                    <p className="text-sm mt-4 text-center">
                      Your subscription ends on{" "}
                      <Moment
                        date={user.subscription_end}
                        format="MMMM Do YYYY"
                      />
                    </p>
                  </>
                )}
            </article>
            <article className="w-full xl:w-[350px] bg-white mb-10 lg:px-4 px-6 py-10 text-left text-primary-dark rounded-lg dark:bg-dark3 dark:text-gray-100">
              <h5 className="font-bold text-base mb-3">
                DAO&apos;s &amp; Communities
              </h5>
              <h2 className="flex justify-start pb-4 font-bold border-b border-gray-200">
                <span className="text-2xl mt-4 mr-1">CUSTOM PACKAGE</span>
              </h2>
              <ul className="text-sm font-bold">
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  All the features of FREE
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  All the features of Premium
                </li>
                <li className="pt-4 pb-4">
                  <CheckIcon
                    className="h-6 w-6 inline cursor-pointer text-green-500 mr-2"
                    aria-hidden="true"
                  />
                  Access for everyone in your community
                </li>
              </ul>
              <button className="uppercase text-center text-sm mt-12 xl:px-24 px-12 sm:px-16 py-2 rounded-md font-bold text-white bg-burple w-full">
                <Link href="https://twitter.com/N8Solomon">
                  <a target="_blank">CONTACT US</a>
                </Link>
              </button>
            </article>
          </section>
        </div>
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
