import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function UpcomingDrop() {
  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <img
              src="https://cdn.collector.sh/drops/zmb/image17.jpeg"
              className="object-center object-cover"
            />
          </div>
        </div>
        <div className="sm:col-span-5 sm:col-end-13">
          <p>February 3rd, Presale 12pm EST, Public 6:09pm EST</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            ZMB
          </h2>
          <p>
            Created by{" "}
            <Link href="https://twitter.com/XO12XX" title="Neverland">
              <a target="_blank">Tony T</a>
            </Link>
          </p>
          <p className="mt-4">
            1/1 PFP project of 4,269 hand drawn monkes. Each monke is hand drawn
            by Solana based 1/1 artist{" "}
            <Link href="https://twitter.com/ohareyoufat">
              <a target="_blank">@ohareyoufat</a>
            </Link>
          </p>
          <div className="mt-8">
            <Link href="/drops/zmb" title="Zero Monke Biz">
              <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                See the Drop
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
