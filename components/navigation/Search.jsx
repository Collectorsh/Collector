import { useRouter } from "next/router";

function Search(props) {
  const router = useRouter();

  function doSearch(e) {
    e.preventDefault();
    let query = document.getElementById("query").value;
    router.push({ pathname: "/search/" + query });
  }

  return (
    <div className="relative -mt-1">
      <form id="search" onSubmit={doSearch} className="w-full">
        <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
          <span className="text-neutral-500 dark:text-neutral-100 sm:text-sm">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-0"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#9946ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M21.0004 20.9999L16.6504 16.6499"
                stroke="#9946ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
        <input
          type="text"
          id="query"
          name="query"
          placeholder="Search by wallet address"
          defaultValue={props.publicKey}
          className="pl-8 md:w-[450px] lg:w-[380px] xl:w-[550px] pr-4 py-3 block border-none border search w-full outline-none text-neutral-800 dark:text-neutral-300 placeholder-neutral-400 bg-transparent rounded-3xl"
        />
      </form>
    </div>
  );
}

export default Search;
