import React, { useContext } from "react";
import UserContext from "/contexts/user";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveUser from "/data/user/saveUser";

export default function Settings() {
  const [user, setUser] = useContext(UserContext);

  const saveAll = async () => {
    const estimated_value = document.getElementById("estimated_value");
    const border = document.getElementById("border").checked;
    const shadow = document.getElementById("shadow").checked;
    const rounded = document.getElementById("rounded").checked;
    const names = document.getElementById("names").checked;
    const description = document.getElementById("description").checked;
    const show_artist_name = document.getElementById("show_artist_name");
    const default_visibility =
      document.getElementById("default_visibility").checked;
    const res = await saveUser(user.api_key, {
      border: border,
      shadow: shadow,
      rounded: rounded,
      description: description,
      names: names,
      default_visibility: default_visibility,
      show_artist_name: show_artist_name ? show_artist_name.checked : null,
      estimated_value: estimated_value ? estimated_value.checked : null,
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
    <div className="dark:bg-black">
      <CheckLoggedIn />
      <Toaster />
      <MainNavigation />

      <div className="mx-auto px-2 md:px-4 lg:px-12">
        <div className="mx-auto px-2 md:px-0 pb-12 mt-16 sm:mt-36">
          <h2 className="text-5xl font-extrabold mb-8 text-black w-fit py-1 inline-block dark:text-whitish">
            Settings
          </h2>

          {user && (
            <div className="clear-both mt-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:border-dark2 dark:bg-dark2">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 inline align-middle">
                    Gallery Configuration
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
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Estimated Value
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="estimated_value"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="estimated_value"
                              className="sr-only"
                              defaultChecked={user.estimated_value}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Show estimated value in Gallery view
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Image Borders
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="border"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="border"
                              className="sr-only"
                              defaultChecked={user.border}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          If selected images in your gallery will have a border
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        NFT Names
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="names"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="names"
                              className="sr-only"
                              defaultChecked={user.names}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Controls whether or not to show the NFT name below
                          each image in your gallery
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Artist Names
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="show_artist_name"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="show_artist_name"
                              className="sr-only"
                              defaultChecked={user.show_artist_name}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Show artists name and Twitter handle in your Gallery
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        NFT Descriptions
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="description"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="description"
                              className="sr-only"
                              defaultChecked={user.description}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Controls whether or not to show the NFT description
                          below each image in your gallery
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Drop Shadow
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="shadow"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="shadow"
                              className="sr-only"
                              defaultChecked={user.shadow}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Do you want images and descriptions to have a drop
                          shadow?
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white dark:bg-dark2">
                      <dt className="text-sm font-medium text-gray-500">
                        Rounded Corners
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="rounded"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="rounded"
                              className="sr-only"
                              defaultChecked={user.rounded}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          Should images in the your gallery have rounded
                          corners?
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50 dark:bg-dark3">
                      <dt className="text-sm font-medium text-gray-500">
                        Default Visibility
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center w-full mb-2">
                          <label
                            htmlFor="default_visibility"
                            className="flex items-center cursor-pointer relative mb-4"
                          >
                            <input
                              type="checkbox"
                              id="default_visibility"
                              className="sr-only"
                              defaultChecked={user.default_visibility}
                            />
                            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
                          </label>
                        </div>
                        <div className="text-gray-500">
                          If selected new images added to your wallets will
                          automatically be visible in your gallery
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
    </div>
  );
}
