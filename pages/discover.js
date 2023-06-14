import MainNavigation from "../components/navigation/MainNavigation";
import ContentLoader from "react-content-loader";
import Link from "next/link";
import { useAllGalleries } from "../data/home/getAllGalleries";
import { useRef, useState } from "react";
import { cdnImage } from "../utils/cdnImage";
import debounce from "lodash.debounce";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, XCircleIcon } from "@heroicons/react/solid";
import { addDefaultSource } from "../utils/addDefaultSource";
import axios from "axios";

const totalPerPage = 8

export default function Discover() {
  const searchRef = useRef()
  const [search, setSearch] = useState();
  const [page, setPage] = useState(1);
  const {galleries, total} = useAllGalleries(page, totalPerPage, search)

  const totalPages = Math.ceil(total/totalPerPage)
  const searchDebounce = debounce((text) => {
    setSearch(text);
    setPage(1)
  }, 300)


  const handleSearch = (e) => {
    searchDebounce(e.target.value);
  }

  const loadingCards = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <div className="" key={index}>
        <div
          className="bg-gray-300/20 lg:shadow-lg rounded-xl relative p-3 mx-auto"
        >
          <ContentLoader
            speed={2}
            className="w-full mb-4 h-[250px] rounded-lg"
            backgroundColor="#bbbbbb"
            foregroundColor="#aaaaaa"
          >
            <rect className="w-full h-full" />
          </ContentLoader>
          <ContentLoader
            speed={2}
            className="w-full h-8 mt-2"
            backgroundColor="#bbbbbb"
            foregroundColor="#aaaaaa"
          >
            <circle cx="16" cy="16" r="16" />
            <rect x="46" y="5" className="w-[80%] h-3/4" rx="4" />
          </ContentLoader>
        </div>
      </div>
    ))
  }

  const imageCards = () => {
    return galleries.map((item, index) => {
      if (!item.image) {
        console.log("no image", item)
        return null
      }
      return <ImageCard key={item.mint} item={item}/>
    })
  }

  return (
    <div>
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 clear-both">
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-white">
            Discover
          </h2>
          <div className="grid content-center gap-2 md:grid-cols-3">
            <div className="flex items-center justify-between gap-1 border-black dark:border-white border-2 rounded-md p-2 mb-4 ">
              <input
                ref={searchRef}
                className="border-none bg-transparent w-full outline-none"
                placeholder="Search by Username"
                onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearch("")
                    e.target.value = ""
                  }
                }}
              />
              {search
                ? (
                  <button
                    onClick={() => {
                      setSearch("")
                      if (searchRef.current) {
                        searchRef.current.value = ""
                      }
                    }}
                  >
                    <XCircleIcon className="fill-black dark:fill-white" width={20} height={20} />
                  </button>
                )
                : null
              }
            </div>
            <div className="mb-4 flex justify-center items-center gap-2">
              <button
               className="disabled:invert-[0.5]"
                disabled={Boolean(page === 1)}
                onClick={() => setPage(1)}
              >
                <ChevronDoubleLeftIcon className="fill-black dark:fill-white" width={16} height={16} />
              </button>
              <button
                className="disabled:invert-[0.5]"
                disabled={Boolean(page === 1)}
                onClick={() => setPage(prev => prev-1)}
              >
                <ArrowLeftIcon className="fill-black dark:fill-white" width={16} height={16}/>
              </button>

              {total ? <span className="mx-2">{page} / {total ? totalPages : "..."}</span> : null}

              <button
                className="disabled:invert-[0.5]"
                disabled={Boolean(page >= totalPages)}
                onClick={() => setPage(prev => prev+1)}
              >
                <ArrowRightIcon className="fill-black dark:fill-white" width={16} height={16} />
              </button>
              <button
                 className="disabled:invert-[0.5]"
                disabled={Boolean(page >= totalPages)}
                onClick={() => setPage(totalPages)}
              >
                <ChevronDoubleRightIcon className="fill-black dark:fill-white" width={16} height={16} />
              </button>
            </div>

            <div />
          </div>


          {galleries && !total
            ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-center mt-10">Sorry, we were not able to find any results 🥲</p>
              </div>
            )
            : null
          }
          <div className="pb-3 gap-3 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galleries
              ? imageCards()
              : loadingCards()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const ImageCard = ({item }) => {
  const [errorCount, setErrorCount] = useState(0)
  const defaultSource = async (e, mint, url) => {
    e.target.style.background = "black";
    e.target.style.opacity = 0;
    if (errorCount > 1) return
    setErrorCount(prev => prev + 1)
    if (!url) return;
    try {
      const res = await axios.get(url).then(res => {
        return res.data
      })
      const image = typeof res.image === "object" ? res.image : url

      e.target.src = image;
      e.target.style.opacity = 1;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div key={item.image} className="">
      <div
        className="bg-gray-300/20 sm:shadow-lg rounded-xl overflow-hidden relative p-3 mx-auto"
      >
        <div className="rounded-lg overflow-hidden flex justify-center items-center mb-4 relative h-[250px]">
          <Link href={`/${ item.username }`}>
            <a>
              <img
                // src={item.image}
                src={cdnImage(item.mint)}
                onError={(e) => defaultSource(e, item.mint, item.image)}
                className="rounded-lg flex-shrink-0 absolute inset-0 w-full h-full object-cover"
              />
            </a>
          </Link>
        </div>
        <div className="mt-2">
          <Link href={`/${ item.username }`}>
            <a>
              {item.twitter_profile_image && (
                <img
                  src={item.twitter_profile_image}
                  className="w-8 h-8 mr-1.5 rounded-full float-left"
                  onError={(e) => {
                    e.target.className = "hidden"
                  }}
                />
              )}

              <div className="mt-2">
                {item.username && (
                  <p className="inline font-bold leading-7">
                    {item.username}
                  </p>
                )}
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}