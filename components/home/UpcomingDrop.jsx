import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function UpcomingDrop() {
  return (
    <div className="max-w-4xl mx-auto sm:my-12 p-4 shadow-lg bg-white dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <div className="text-center">
            <img
              src="/images/drops/neverland/re43f9ejbhxegwf9re4385fq2h5rltsb.png"
              className="h-96 object-center object-cover"
            />
          </div>
        </div>
        <div className="sm:col-span-6 sm:col-end-13">
          <p>January 26th, 10am EST</p>
          <h2 className="align-middle sm:inline sm:my-5 text-4xl font-bold w-full py-1 inline-block">
            PAUSE
          </h2>
          <p>
            Curated by{" "}
            <Link href="https://twitter.com/XO12XX" title="Neverland">
              <a target="_blank">Neverland</a>
            </Link>
          </p>
          <p className="mt-4">
            A collective of photographers from all around the world pressing the
            pause button on life.
          </p>
          <div className="mt-8">
            <Link href="/drops/neverland" title="Neverland Drop">
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
            <Link href="https://twitter.com/@XO12XX" title="Nev">
              <a target="_blank">
                <img
                  src="/images/neverland.jpeg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@visualiterature"
              title="George Figueroa"
            >
              <a target="_blank">
                <img
                  src="/images/drops/artists/georgef.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@farhannsrdn" title="H A N">
              <a target="_blank">
                <img
                  src="/images/drops/artists/han.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@hacss" title="Hacs">
              <a target="_blank">
                <img
                  src="/images/drops/artists/hacs.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@huxsterized" title="Huxsterized">
              <a target="_blank">
                <img
                  src="/images/drops/artists/hux.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@jakob_lr" title="Jakob Lilja-Ruiz">
              <a target="_blank">
                <img
                  src="/images/drops/artists/jakob.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@jairo_ema25" title="Jairinho">
              <a target="_blank">
                <img
                  src="/images/drops/artists/jairinho.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@drjaytoor" title="Jay Toor">
              <a target="_blank">
                <img
                  src="/images/drops/artists/jaytoor.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@thejomshoots" title="JOM">
              <a target="_blank">
                <img
                  src="/images/drops/artists/jom.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@layers_jpg" title="layers">
              <a target="_blank">
                <img
                  src="/images/drops/artists/layers.png"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@okayflix" title="Logan Jamess">
              <a target="_blank">
                <img
                  src="/images/drops/artists/loganj.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@najshukor" title="Naj Shukor">
              <a target="_blank">
                <img
                  src="/images/drops/artists/najs.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link href="https://twitter.com/@rich_herrmann" title="Rich Herman">
              <a target="_blank">
                <img
                  src="/images/drops/artists/richh.jpg"
                  className="w-full h-36 w-full object-center object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="https://twitter.com/@taintedphotog"
              title="TaintedPhotog"
            >
              <a target="_blank">
                <img
                  src="/images/drops/artists/taintedphotog.jpg"
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
