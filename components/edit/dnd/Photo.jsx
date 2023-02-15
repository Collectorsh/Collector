import React, { forwardRef } from "react";
import { cdnImage } from "/utils/cdnImage";
import imageExists from "image-exists";
import axios from "axios";
import apiClient from "/data/client/apiClient";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, ...props }, ref) => {
    const height = props.height ? props.height : 200;

    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: height,
      width: "100%",
      gridRowStart: index === 0 ? "span 1" : null,
      gridColumnStart: index === 0 ? "span 1" : null,
      backgroundColor: "grey",
      ...style,
    };

    if (props.width) {
      inlineStyles.width = height;
    }

    const addDefaultSource = async (e, mint, url) => {
      const res = await axios.get(url);
      const image = res.data.image;
      imageExists(image, function (exists) {
        if (exists) {
          console.log(image);
          e.target.src = image;
          try {
            let images = [{ uri: image, mint: mint }];
            apiClient.post("/images/upload", {
              images: images,
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    };

    function classNames(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    return (
      <div className="relative">
        <img
          className="w-full opacity-0 cursor-pointer hover:origin-center object-center object-cover shadow-sm"
          src={cdnImage(mint)}
          onError={(e) => addDefaultSource(e, mint, uri)}
          ref={ref}
          style={inlineStyles}
          {...props}
        />
        <Menu as="div" className="absolute top-1 right-0">
          <div>
            <Menu.Button className="inline-flex justify-center focus:outline-none">
              <DotsVerticalIcon
                className="h-6 w-6 inline cursor-pointer text-white"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`/nft/${mint}`}
                      target="_blank"
                      rel="noreferrer"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm cursor-pointer"
                      )}
                    >
                      Go to Listing
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );
  }
);

Photo.displayName = "Photo";
