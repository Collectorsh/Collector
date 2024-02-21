import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import clsx from "clsx";
import * as Icon from 'react-feather'
const SearchBar = ({ search, setSearch, placeholder = "Search", className, onEnter }) => {
  const searchRef = useRef(null)

  const searchDebounce = debounce((text) => {
    setSearch(text);
  }, 300)

  const handleSearch = (e) => {
    searchDebounce(e.target.value);
  }
  useEffect(() => {
    if (!search && searchRef.current) searchRef.current.value = ""
  }, [search])
  
  return (
    <div className={clsx(
      "flex items-center justify-between gap-1 border-2 rounded-lg p-2",
      "palette2 borderPalette3",
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
          if (e.key === "Enter" && onEnter) onEnter(search)
        }}
      />
      {search
        ? (
          <button
            className="hoverPalette3 p-0.5 rounded-full"
            onClick={() => {
              setSearch("")
              if (searchRef.current) {
                searchRef.current.value = ""
              }
            }}
          >
            <Icon.X size={20} strokeWidth={2.5} />
            {/* <XCircleIcon className="fill-black dark:fill-white" width={20} height={20} /> */}
          </button>
        )
        : null
      }
    </div>
  )
}

export default SearchBar