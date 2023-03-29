import React, { useState, useContext, useEffect, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { error } from "/utils/toastMessages";
import UserContext from "/contexts/user";
import fetchAllUsers from "/data/hubs/fetchAllUsers";
import addUser from "/data/hubs/addUser";
import removeUser from "/data/hubs/removeUser";
import { TrashIcon } from "@heroicons/react/solid";

export default function Users({ users, updateUsers }) {
  console.log(users);
  const [user] = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState();

  const asyncFetchAllUsers = useCallback(async () => {
    const res = await fetchAllUsers(user.api_key);
    setAllUsers(res.all_users);
  }, []);

  useEffect(() => {
    asyncFetchAllUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setResults();
    } else {
      doSearch();
    }
  }, [searchTerm]);

  const doSearch = async () => {
    let res = allUsers.filter((u) => u.username.startsWith(searchTerm));
    setResults(res);
  };

  const doAddUser = async (id) => {
    setSearchTerm("");
    const res = await addUser(user.api_key, id);
    if (res.status === "success") {
      updateUsers(res.allowed_users);
      setAllUsers(res.all_users);
    } else if (res.status === "error") error(res.msg);
  };

  const doRemoveUser = async (id) => {
    const res = await removeUser(user.api_key, id);
    if (res.status === "success") {
      updateUsers(res.allowed_users);
      setAllUsers(res.all_users);
    } else if (res.status === "error") error(res.msg);
  };

  return (
    <>
      <Toaster />
      <div className="mt-8 pb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-0 top-0 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-100 sm:text-sm ml-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="#aaa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M21.0004 20.9999L16.6504 16.6499"
                  stroke="#aaa"
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
            placeholder="Add users to your hub"
            className="pl-10 md:w-[400px] lg:w-[500px] pr-4 py-3 block border border-neutral-100 dark:border-neutral-800 w-full outline-none text-gray-800 dark:text-gray-300 placeholder-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
        {results && (
          <div className="min-h-[100px] w-[500px] bg-gray-100 dark:bg-dark3 absolute z-10 text-left p-4 rounded-b-lg">
            <ul className="leading-10">
              {results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="group cursor-pointer hover:text-black dark:hover:text-white hover:font-bold"
                      onClick={() => doAddUser(result.id)}
                    >
                      {result.twitter_profile_image && (
                        <img
                          className="mr-2 w-6 h-6 rounded-full inline"
                          src={result.twitter_profile_image}
                        />
                      )}
                      {result.username}
                      <span className="float-right text-green-500 hidden group-hover:inline-block">
                        Add
                      </span>
                      {result.twitter_screen_name && (
                        <span className="float-right mr-6 text-gray-600">
                          @{result.twitter_screen_name}
                        </span>
                      )}
                    </li>
                  ))}
                </>
              ) : (
                <li>No results found</li>
              )}
            </ul>
          </div>
        )}
        {users.length > 0 && (
          <table className="mt-10 relative h-full min-w-full rounded-lg border-gray-100 dark:border-gray-900 border-0 border-separate [border-spacing:0_0.5rem]">
            <thead className="top-[9rem] bg-white dark:bg-dark2">
              <tr>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-left text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="first:rounded-tl-lg last:rounded-tr-lg 6px; text-center text-button-lg font-semibold py-4 px-6 text-gray-600 dark:text-gray-400 ng-star-inserted"
                >
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="bg-transparent dark:bg-dark3 dark:border-0 dark:text-gray-50 h-full lg:hover:shadow-[0_12px_40px_0px_rgba(0,0,0,0.18)] rounded-xl shadow-[0_12px_40px_0px_rgba(0,0,0,0.06)] text-gray-900 ng-star-inserted"
                >
                  <td className="py-4 px-6">{user.username}</td>
                  <td className="py-4 px-6 text-center">
                    <TrashIcon
                      className="inline h-5 w-5 align-middle cursor-pointer text-red-700"
                      onClick={() => doRemoveUser(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
