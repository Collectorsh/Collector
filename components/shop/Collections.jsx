import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { roundToTwo } from "/utils/roundToTwo";
import CartIcon from "/components/shop/CartIcon";
import getCollections from "/data/shop/getCollections";

export default function Collections() {
  const [collections, setCollections] = useState();

  const initGetCollections = useCallback(async () => {
    let res = await getCollections();
    setCollections(res);
  }, []);

  useEffect(() => {
    initGetCollections();
  }, []);

  return (
    <div className="mb-12">
      <>
        <CartIcon showBack={false} showCart={true} />
        <h1 className="font-semibold text-4xl mt-10 w-fit">Collections</h1>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {collections &&
            collections.map((collection, index) => (
              <Link
                href={`/shop/collection/${collection.uuid}`}
                title=""
                key={index}
              >
                <a>
                  <div
                    key={index}
                    className="hover:cursor-pointer border-2 p-2 hover:bg-greenlightbg hover:dark:bg-greendarkbg hover:border-greeny hover:dark:border-greeny border-white dark:border-black text-gray-700 dark:text-white hover:dark:text-white"
                  >
                    <div className="min-h-80 aspect-w-1 aspect-h-1 w-full bg-white dark:bg-black border-2 border-black dark:border-white rounded-lg">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="object-cover object-center w-full h-full rounded-md"
                      />
                    </div>
                    <div className="mt-4 w-full">
                      <h3 className="text-lg w-fit mx-auto">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </>
    </div>
  );
}
