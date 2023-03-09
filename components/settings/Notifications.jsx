import React, { useContext } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveUser from "/data/user/saveUser";

export default function Notifications() {
  const [user, setUser] = useContext(UserContext);

  const saveAll = async () => {
    const notify_trending = document.getElementById("notify_trending");
    const notify_outbid = document.getElementById("notify_outbid");
    const notify_new_artist = document.getElementById("notify_new_artist");
    const notify_twitter = document.getElementById("notify_twitter");
    const notify_email = document.getElementById("notify_email");
    const res = await saveUser(user.api_key, {
      notify_trending: notify_trending ? notify_trending.checked : null,
      notify_outbid: notify_outbid ? notify_outbid.checked : null,
      notify_new_artist: notify_new_artist ? notify_new_artist.checked : null,
      notify_twitter: notify_twitter ? notify_twitter.checked : null,
      notify_email: notify_email ? notify_email.checked : null,
    });
    if (res.data) {
      if (res.data.status === "success") {
        success("Updated successfully");
        setUser(res.data.user);
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
        <div className="mt=8 lg:mt-16 mb-12">
          {user && (
            <div className="clear-both mt-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                    Notification Settings
                  </h3>
                  <div className="float-right align-middle -mt-3">
                    <button
                      className="py-2.5 px-4 rounded-3xl bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-200 font-bold"
                      onClick={(e) => saveAll(e)}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-dark3">
                  <dl>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        Trending Auctions
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="notify_trending"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="notify_trending"
                              className="sr-only"
                              defaultChecked={user.notify_trending}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Receive a notification about trending auctions
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Outbid Notifications
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="notify_outbid"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="notify_outbid"
                              className="sr-only"
                              defaultChecked={user.notify_outbid}
                            />
                            <div className="toggle-bg bg-white border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Receive a notification when you are outbid on an
                          auction
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        New Artist Auction
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="notify_new_artist"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="notify_new_artist"
                              className="sr-only"
                              defaultChecked={user.notify_new_artist}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Receive a notification when an artist lists their
                          first auction
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                        Delivery Settings
                      </h3>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="notify_email"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="notify_email"
                              className="sr-only"
                              defaultChecked={
                                user.email ? user.notify_email : false
                              }
                              disabled={!user.email}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Receive notifications via email
                        </div>
                        {!user.email && (
                          <div className="text-red-300 dark:text-red-800 mt-2">
                            You haven&apos;t added your email address
                          </div>
                        )}
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
