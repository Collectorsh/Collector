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

const totalPerPage = 12

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
    <div className="relative mx-auto w-fit my-4">
      <div className="bg-neutral-300 dark:bg-neutral-700 h-7 flex justify-center items-center px-6 py-4 font-bold text-small rounded-full">
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
  return (
    <>
      <MainNavigation />

      <div className="relative w-full max-w-screen-2xl  mx-auto px-6 sm:px-11 pt-12 pb-28" >
        <h2 className="text-5xl font-bold mb-5">Discover</h2>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 w-full">
            <SearchBar
              className="w-full max-w-[20rem] bg-neutral-200 dark:bg-neutral-900 flex-shrink-0"
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
          <div className="w-20">
            order by
          </div>
        </div>
        <hr className="mt-6 mb-12 borderPalette2" />

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

