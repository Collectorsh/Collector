import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import getGalleries from "/data/home/getGalleries";
import { Oval } from "react-loader-spinner";
import debounce from "lodash.debounce";

export default function Galleries() {
  const [search, setSearch] = useState("");
  const [galleries, setGalleries] = useState();
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = [...["#"], ...alpha.map((x) => String.fromCharCode(x))];

  const searchDebounce = debounce((text) => {
    setSearch(text);
  }, 300)

  const handleSearch = (e) => { 
    searchDebounce(e.target.value);
  }

  const fetchGalleries = useCallback(async () => {
    let res = await getGalleries();
    setGalleries(res.data.filter((u) => u.twitter_profile_image));
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

  const removeElement = (e) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add(
      "bg-neutral-100",
      "dark:bg-dark3",
      "w-12",
      "h-12",
      "rounded-full",
      "overflow-hidden",
      "mx-auto",
      "float-left",
      "align-middle"
    );
    e.target.parentNode.parentNode?.replaceChild(
      newDiv,
      e.target.parentNode.parentNode.children[0]
    );
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
          <input
            className="border-black dark:border-white border-2 rounded-md p-2 mb-4 bg-transparent"
            placeholder="Search by Username"
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearch("")
                e.target.value = ""
              }
            }}
          />
          {alphabet.map((letter, index) => (
            <div key={letter+index}>
              <h2 className="font-bold underline mb-4 dark:text-whitish">
                {letter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {series(letter).filter(item => item.username.includes(search)).map((item, index) => (
                  <div
                    key={item.username}
                    className="mb-6 w-fit py-2 px-4 cursor-pointer dark:text-whitish align-middle"
                  >
                    <Link href={`/${item.username}`} title="" legacyBehavior>
                      <a>
                        <div className="w-12 h-12 rounded-full overflow-hidden mx-auto float-left align-middle">
                          {item.twitter_profile_image && (
                            <img
                              src={item.twitter_profile_image}
                              className="object-center object-cover"
                              onError={(e) => removeElement(e)}
                            />
                          )}
                          {!item.twitter_profile_image && (
                            <div className="bg-neutral-100 dark:bg-dark3" />
                          )}
                        </div>
                        <div className="font-bold hover:underline ml-16 pt-3 align-middle">
                          {item.username}
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
