import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function UpcomingDrop() {
  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <img
              src="https://cdn.collector.sh/drops/hanaknight/k9lvii971i33ooy59c6xk9lviwbscdq6.png"
              className="h-96 object-center object-cover"
            />
          </div>
        </div>
        <div className="sm:col-span-6 sm:col-end-13">
          <p>January 18th, 4pm EST</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            Nusantara Blooming
          </h2>
          <p>
            Curated by{" "}
            <Link href="https://twitter.com/_hanaknight17" title="Hana Knight">
              <a target="_blank">Hana Knight</a>
            </Link>
          </p>
          <p className="mt-4">
            A collection of varied interpretations surrounding the theme of
            nature and humanity. Brought to you by artists across genres from
            Indonesia.
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
            <Link href="https://twitter.com/@vegarifi" title="Balada Perupa">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/balada.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@michaelmicasso" title="MEK.txt">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/mek.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@arissamaa" title="Arissu">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/arissu.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@monksealpng" title="Monkseal">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/monkseal.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@ficklesight" title="Fickle Sight">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/ficklesight.jpeg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@lapantigatiga"
              title="Lapantigatiga"
            >
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/lapan.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/_hanaknight17" title="Hana Knight">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/hana.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@xxalfsyr" title="Adam Alfisyar">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/adam.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@ordinary_sol" title="Ordinary">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/ordinary.jpeg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/duckzzyog" title="Duckzzy">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/duck.gif"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@cufives" title="Cufives">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/cufives.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@septadenata" title="SDNT">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/hanaknight/kqwounmx26n6d1xkqwoup3orkfrz73e7.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@aninditowisnu"
              title="Anindito Wisnu"
            >
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/anindito.jpeg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@destroyxstairs" title="SDNT">
              <a target="_blank">
                <img
                  src="https://cdn.collector.sh/drops/artists/destroystairs.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
