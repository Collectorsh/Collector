import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getGalleries from "/data/home/getGalleries";
import { Oval } from "react-loader-spinner";

export default function Galleries() {
  const [galleries, setGalleries] = useState();
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = [...["#"], ...alpha.map((x) => String.fromCharCode(x))];

  const fetchGalleries = useCallback(async () => {
    let res = await getGalleries();
    setGalleries(res.data);
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const series = (letter) => {
    var results = [];
    if (letter === "#") {
      results = galleries.filter(
        (g) => !alphabet.includes(g.username.toUpperCase()[0])
      );
    } else {
      results = galleries.filter(
        (g) => g.username.toLowerCase()[0] === letter.toLowerCase()
      );
    }
    return results;
  };

  return (
    <>
      {!galleries && (
        <div className="mt-4 w-[50px] h-64 mx-auto mt-20">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
      {galleries && (
        <>
          <h2 className="text-4xl font-extrabold mb-8 text-black w-fit inline-block dark:text-white">
            Galleries
          </h2>
          {alphabet.map((letter, index) => (
            <div key={index}>
              <h2 className="font-bold underline mb-4 dark:text-whitish">
                {letter}
              </h2>
              <>
                {series(letter).map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded py-2 px-4 cursor-pointer dark:text-whitish align-middle"
                  >
                    <Link href={`/${item.username}`} title="">
                      <a>
                        {item.twitter_profile_image && (
                          <img
                            src={item.twitter_profile_image}
                            className="w-12 h-12 rounded-full mx-auto float-left align-middle"
                          />
                        )}
                        {!item.twitter_profile_image && (
                          <div className="w-12 h-12 rounded-full mx-auto float-left align-middle bg-gray-100 dark:bg-dark3" />
                        )}
                        <div className="font-bold hover:underline ml-16 pt-3 align-middle">
                          {item.username}
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </>
            </div>
          ))}
        </>
      )}
    </>
  );
}
