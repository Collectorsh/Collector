import { useRef } from "react";
import { XCircleIcon } from "@heroicons/react/solid";
import debounce from "lodash.debounce";
import clsx from "clsx";

const SearchBar = ({ search, setSearch, placeholder="Search", className }) => { 
  const searchRef = useRef(null)

  const searchDebounce = debounce((text) => {
    setSearch(text);
  }, 300)

  const handleSearch = (e) => {
    searchDebounce(e.target.value);
  }
  return (
    <div className={clsx(
      "flex items-center justify-between gap-1 border-2 rounded-md p-2 mb-4",
      "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900",
      className
    )} >
      <input
        ref={searchRef}
        className="border-none bg-transparent w-full outline-none"
        placeholder={placeholder}
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
  )
}

export default SearchBar