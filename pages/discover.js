import MainButton from "../components/MainButton";
import SearchBar from "../components/SearchBar";
import MainNavigation from "../components/navigation/MainNavigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchPublishedCurations } from "../data/curation/searchCurations";
import { Oval } from "react-loader-spinner";
import LandingCurationItem, { LandingCurationItemPlaceholder } from "../components/landing/curationItem";
import useSWR from 'swr'
import { getAllPublished } from "../data/curation/getAllPublished";
import * as Icon from "react-feather";
import { RoundedCurve } from "../components/curations/roundedCurveSVG";
import { generateArrayAroundNumber } from "../utils/maths";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";

const totalPerPage = 12

const orderByOptions = [
  { name: "Most Recent", value: "recent" },
  { name: "Oldest", value: "oldest" },
  { name: "A to Z", value: "a-z" },
  { name: "Z to A", value: "z-a" },
  { name: "Sales (High to Low)", value: "most-sales" },
  // { name: "Most Viewed", value: "popular" }
]

export default function Discover() {
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [orderBy, setOrderBy] = useState("recent"); //"recent", "a-z", "z-a", "oldest", "most-sales"? "popular"?
  const [pages, setPages] = useState([0, 1, 2, 3, 4])
  const { data, error } = useSWR({ page: page + 1, perPage: totalPerPage, orderBy }, getAllPublished)

  const discoverResults = data?.curation_results;
  const total = data?.total
  const totalPages = Math.ceil(total / totalPerPage)



  useEffect(() => {
    if (!search) setSearchResults(null)
  }, [search])
  
  useEffect(() => {
    if(!total) return
    const genPages = generateArrayAroundNumber({
      num: page,
      lowerBound: 0,
      upperBound: Math.floor(total / totalPerPage)
    })
    setPages(genPages)
  }, [page, total]) 

  const handleSearch = async () => {
    setSearching(true)
    const results = await searchPublishedCurations(search)
    if (results?.curation_results) {
      setSearchResults(results.curation_results)
    } else {
      setSearchResults([])
    }
    setSearching(false)
  }
  const handleOrderChange = (value) => {
    setSearch("")
    setOrderBy(value)
    setPage(0)
  }

  const curations = searchResults?.length
    ? searchResults
    : discoverResults
  
  const curationContent = curations?.length
    ? curations.map(curation => (
      <LandingCurationItem
        key={curation.id}
        curation={curation}
      />))
    : Array.from({ length: totalPerPage }).map((_, i) => <LandingCurationItemPlaceholder key={i} />)

  const pagination = (
    <div className="relative mx-auto w-fit my-8">
      <div className="bg-neutral-300 dark:bg-neutral-700 h-7 flex justify-center items-center px-4 py-4 font-bold text-small rounded-full">
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(0)}
          disabled={page === 0}
        >
          <Icon.ChevronsLeft />
        </button>
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(prev => prev - 1)}
          disabled={page === 0}
        >
          <Icon.ChevronLeft />
        </button>
        {pages.map((num, i) => (
          <button
            key={i}
            className={clsx(
              "rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none w-7 h-7 hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300",
              num === page ? "bg-neutral-200 dark:bg-neutral-800" : ""
            )}
            onClick={() => setPage(num)}
          >
            {num + 1}
          </button>
        ))}
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(prev => prev + 1)}
          disabled={page >= Math.floor(total / totalPerPage)}
        >
          <Icon.ChevronRight />
        </button>
        <button
          className="rounded-full p-0.5 disabled:opacity-50 disabled:pointer-events-none hover:bg-neutral-200 dark:hover:bg-neutral-800 duration-300"
          onClick={() => setPage(Math.floor(total / totalPerPage))}
          disabled={page >= Math.floor(total / totalPerPage)}
        >
          <Icon.ChevronsRight />
        </button>
      </div>
      {/* <RoundedCurve className="absolute bottom-0 -right-10 w-10 h-7 fill-neutral-300 dark:fill-neutral-700 transform scale-x-[-1] rotate-180" />
      <RoundedCurve className="absolute bottom-0 -left-10 w-10 h-7 fill-neutral-300 dark:fill-neutral-700 rotate-180" /> */}
    </div>
  )

  const orderDropDown = (
    <Listbox value={orderBy} onChange={handleOrderChange}>
      {({ open }) => (
        <>
          <Listbox.Button className="text-current 
                    w-full h-fit flex justify-between items-center gap-2 flex-shrink-0
                    px-3.5 py-2 outline-none rounded-md border-2 bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 hoverPalette1
                  "
          >
            <p className="">
              {orderByOptions.find(option => option.value === orderBy)?.name || "Order By"}
            </p>
            <Icon.ChevronDown size={20} strokeWidth={2.5} className={clsx("duration-300", open && "rotate-180")} />
          </Listbox.Button>
          <Transition
            className="relative z-10"
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="mt-2 absolute top-0 left-0 w-full palette2 p-2 rounded shadow z-30">
                {orderByOptions.map((option) => (
                  <Listbox.Option key={option.value} value={option.value}>
                    <div
                      className={clsx(
                        "p-2 flex gap-1 items-center w-full cursor-pointer rounded",
                        'hoverPalette2'
                      )}
                    >
                      <p>
                        {option.name}
                      </p>
                    </div>
                  </Listbox.Option>
                ))}

            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  )
  return (
    <>
      <MainNavigation />

      <div className="relative w-full max-w-screen-2xl  mx-auto px-6 sm:px-11 pt-12 pb-28" >
        <h2 className="text-5xl font-bold ">Discover</h2>
        <hr className="mt-6 mb-10 borderPalette2" />
        <div className="grid md:grid-cols-[2fr_auto] gap-2 mb-8">
          <div className="flex gap-2 w-full">
            <SearchBar
              className="w-full max-w-[20rem] bg-neutral-200 dark:bg-neutral-900"
              search={search}
              setSearch={setSearch}
              onEnter={handleSearch}
              placeholder="Curation or curator name"
            />
            <MainButton
              onClick={handleSearch}
              solid
              className="w-[5.65rem] flex justify-center items-center"
            >
              {searching
                ? <Oval color="#FFF" secondaryColor="#666" height={22} width={22} strokeWidth={2.5}/>
                : "Search"
              }
            </MainButton>
          </div>
          <div className="w-52 relative place-self-end">
            {orderDropDown}
          </div>
        </div>
       

        {searchResults && !searchResults.length
          ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-xl font-bold">
                Sorry, no curations found for &quot;{search}&quot;
              </p>
            </div>
          )
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
              {curationContent}
            </div>
          )
        }
        {pagination}
      </div>
    </>
  )
}

