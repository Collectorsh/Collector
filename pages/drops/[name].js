import { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import MainNavigation from "/components/navigation/MainNavigation";
import { PublicKey } from "@solana/web3.js";
import Gacha from "/components/drops/gacha";
import PublicMint from "/components/drops/public";
import getDropFromName from "/data/drops/getDropFromName";
import { fetchImages } from "/hooks/fetchImages";

export default function ArtistDrop({ name, drop }) {
  const [images, setImages] = useState([]);
  const address = drop ? new PublicKey(drop.candy_machine) : null;

  useEffect(() => {
    fetchImages(name).then((imgs) => {
      const imgArray = [];
      for (const i of imgs) {
        if (i.Size > 100) imgArray.push(i.Key);
      }
      setImages(imgArray);
    });
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-7xl mx-auto">
          {drop ? (
            <div className="mx-auto sm:my-12 p-4 bg-white dark:bg-black dark:text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="col-span-1 lg:col-span-7">
                  <img
                    src={drop.image}
                    className="inline w-16 h-16 align-middle rounded-full"
                  />
                  <h2 className="ml-4 align-middle inline my-5 text-4xl font-bold w-full py-1 inline-block">
                    {drop.name}
                  </h2>
                  <p className="mt-4">{drop.curator}</p>
                  <p className="mt-4">{drop.description}</p>
                </div>
                <div className="col-span-1 mt-4 lg:mt-0 lg:col-span-4 lg:col-end-13">
                  {drop.slug === "hanaknight" ? (
                    <Gacha address={address} />
                  ) : (
                    <PublicMint address={address} drop={drop} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
                {images.map((image, i) => (
                  <div className="text-center" key={i}>
                    <img
                      src={`https://cdn.collector.sh/${image}`}
                      className="w-full h-96 lg:h-64 object-center object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-black dark:text-white mt-12">
              We couldn&apos;t find a drop named {name}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    let name = context.params.name;
    let drop = await getDropFromName(name);
    return { props: { name, drop } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
}
