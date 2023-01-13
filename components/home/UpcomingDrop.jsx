import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function UpcomingDrop() {
  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <img
              src="/images/drops/hanaknight/k9lvii971i33ooy59c6xk9lviwbscdq6.png"
              className="w-full h-96 object-center object-cover"
            />
          </div>
        </div>
        <div className="sm:col-span-5 sm:col-end-13">
          <p>January 18th</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            Hana Knight
          </h2>
          <p className="mt-4">
            Curated by Hana Knight this drop features artwork from 11 artists.
          </p>
          <div className="mt-8">
            <Link href="/drops/hanaknight" title="Hana Knight Drop">
              <a className="bg-greeny px-4 py-3 text-lg font-semibold text-black cursor-pointer rounded-xl">
                See the Drop
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="mt-12 mb-6 text-4xl font-bold">Artists</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          <div className="text-center">
            <img
              src="/images/drops/artists/balada.png"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/mek.png"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/arissu.jpg"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/monkseal.jpg"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/ficklesight.jpeg"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/lapan.jpg"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/hana.png"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/adam.png"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/ordinary.jpeg"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/duck.gif"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
          <div className="text-center">
            <img
              src="/images/drops/artists/cufives.png"
              className="w-full h-36 w-full object-center object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
