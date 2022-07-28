import React, { useContext } from "react";
import { useRouter } from "next/router";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveUser from "/data/user/saveUser";
import getTwitterOAuthToken from "/data/dashboard/getTwitterOAuthToken";
import destroyTwitter from "/data/dashboard/destroyTwitter";
import TwitterLogo from "/components/logos/TwitterLogo.jsx";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);

  const connectTwitter = async () => {
    try {
      const res = await getTwitterOAuthToken(user.api_key);
      if (res.status === "success") {
        window.location.assign(res.url);
      } else {
        error(res.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectTwitter = async () => {
    try {
      const res = await destroyTwitter(user.api_key);
      if (res.status === "success") {
        success("Twitter disconnected");
        setUser(res.user);
      } else {
        error(res.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveAll = async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    if (email) {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(email)) {
        error("Invalid email format");
        return;
      }
    }
    const res = await saveUser(user.api_key, {
      username: username,
      email: email,
    });
    if (res.data) {
      if (res.data.status === "success") {
        success("Updated successfully");
        router.push(`/${username}/edit`);
      } else {
        error(res.data.msg);
      }
    } else {
      error("An error occurred");
    }
  };

  return (
    <>
      <Toaster />

      <div>
        <div className="mt=8 lg:mt-16">
          {user && (
            <div className="clear-both mt-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                    Profile
                  </h3>
                  <div className="float-right align-middle -mt-3">
                    <button
                      className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                      onClick={(e) => saveAll(e)}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-dark3">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="col-span-3 sm:col-span-2">
                          <div className="mt-1 flex rounded-md shadow-sm mb-2">
                            <span className="py-2 inline-flex items-center pl-3 rounded-l-md bg-white text-gray-400 text-lg dark:bg-dark2 dark:text-gray-600">
                              https://collector.sh/
                            </span>
                            <input
                              id="username"
                              type="text"
                              placeholder="Name"
                              defaultValue={user.username}
                              className="flex-1 block w-full rounded-none rounded-r-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                        </div>
                        <div className="text-gray-500">
                          Your name is used to create your unique gallery URL
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Twitter
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          {user.twitter_user_id ? (
                            <>
                              <button
                                className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                                onClick={(e) => disconnectTwitter(e)}
                              >
                                <TwitterLogo size="20" />
                                <span className="ml-1">Disconnect</span>
                              </button>
                              <span className="text-gray-900 dark:text-gray-100 text-lg ml-3">
                                @{user.twitter_screen_name}
                              </span>
                            </>
                          ) : (
                            <button
                              className="py-3 px-4 rounded-3xl bg-black text-white dark:bg-whitish dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                              onClick={(e) => connectTwitter(e)}
                            >
                              <TwitterLogo size="20" />
                              <span className="ml-1">Connect</span>
                            </button>
                          )}
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-200">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="col-span-3 sm:col-span-2">
                          <div className="mt-1 flex rounded-md shadow-sm mb-2">
                            <input
                              id="email"
                              type="email"
                              defaultValue={user.email}
                              className="p-2 flex-1 block w-full rounded-md sm:text-lg border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-dark2 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
