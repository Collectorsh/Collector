import React, { forwardRef, useState } from "react";
import axios from "axios";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { addDefaultSource } from "/utils/addDefaultSource";
import CloudinaryImage from "../../CloudinaryImage";
import ContentLoader from "react-content-loader";

export const Photo = forwardRef(
  ({ mint, uri, index, faded, style, section, bulkEdit, ...props }, ref) => {

    const [errorCount, setErrorCount] = useState(0);
    const height = props.height ? props.height : 200;

    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: height,
      width: "100%",
      gridRowStart: index === 0 ? "span 1" : null,
      gridColumnStart: index === 0 ? "span 1" : null,
      backgroundColor: "rgba(120,120,120,0.1)",
      ...style,
    };

    if (props.width) {
      inlineStyles.width = height;
    }

    const defaultSource = async (e, mint, url) => {
      if (errorCount > 1) return;
      setErrorCount(errorCount + 1);
      try {
        const res = await axios.get(url).then(res => {
          return res.data
        })
        const image = typeof res === "object" ? res.image : url

        addDefaultSource(e, mint, image);
      } catch (err) {
        console.log(err);
      }
    };

    function classNames(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    const onImageLoad = (event) => {
      // console.log("LOADED")
      event.target.parentNode.style.display = "block";
    };

    return (
      <div className="relative">
        {section === "visible" && bulkEdit === true && (
          <input
            id={`select-${mint}`}
            type="checkbox"
            name="bulk"
            className="absolute left-1 top-1 w-6 h-6 cursor-pointer"
            style={{ accentColor: "rgba(120,120,120,0.1)" }}
            defaultChecked
          />
        )}
        {/* <img
          className="w-full cursor-pointer hover:origin-center object-center object-cover shadow-sm"
          src={cdnImage(mint)}
          onError={(e) => defaultSource(e, mint, uri)}
          onLoad={onImageLoad}
          ref={ref}
          style={inlineStyles}
          {...props}
        /> */}
        <div
          ref={ref}
          style={inlineStyles}
          {...props}
          className="overflow-hidden rounded-lg shadow-sm"
        >
          <CloudinaryImage
            className="w-full h-full cursor-pointer hover:origin-center object-center object-cover"
            id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ mint }`}
            mint={mint}
            onLoad={onImageLoad}
            width={500}
          />
        </div>
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
            <Menu.Items className="origin-top-right absolute right-1 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                      Go to Artwork
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
