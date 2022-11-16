import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Grid } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { useWallet } from "@solana/wallet-adapter-react";
import Dropzone from "react-dropzone-uploader";

import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
  toMetaplexFileFromBrowser,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export default function Mint() {
  const wallet = useWallet();
  const [file, setFile] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState(0);
  const [externalUrl, setExternalUrl] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const connection = new Connection(clusterApiUrl("devnet"));

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  useEffect(() => {
    if (!name || !wallet || !file) setDisabled(true);
    if (name && name.length < 3) setDisabled(true);
    if (name && name.length > 2 && wallet && file) setDisabled(false);
  }, [name, file, wallet]);

  const onFileChange = ({ file }, status) => {
    if (status === "done") setFile(file);
  };

  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };

  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    if (files.length > 0) return null;
    return (
      <label className="w-full">
        <div className="mt-2 cursor-pointer">Select File</div>
        <input
          className="hidden"
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            getFilesFromEvent(e).then((chosenFiles) => {
              onFiles(chosenFiles);
            });
          }}
        />
      </label>
    );
  };

  const updateName = (name) => {
    if (name.length < 3) {
      setName();
    } else {
      setName(name);
    }
  };

  const doMint = async () => {
    // setDisabled(true);
    // setLoading(true);

    const metaFile = await toMetaplexFileFromBrowser(file);
    const fileUri = await metaplex.storage().upload(metaFile);

    const { uri, metadata } = await metaplex.nfts().uploadMetadata({
      name: name,
      image: fileUri,
      properties: {
        files: [
          {
            type: file.type,
            uri: fileUri,
          },
        ],
      },
    });

    const { nft } = await metaplex.nfts().create({
      uri: uri,
      name: name,
      sellerFeeBasisPoints: royalties * 100,
    });

    console.log(nft);
    console.log(nft.address.toBase58());
  };

  return (
    <div className="w-full sm:w-[550px] mx-auto p-2 mt-12">
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
      <div className="mt-6 relative">
        <Dropzone
          onChangeStatus={onFileChange}
          InputComponent={selectFileInput}
          getFilesFromEvent={getFilesFromEvent}
          accept="image/*,audio/*,video/*"
          maxFiles={1}
          inputContent="Drop A File"
        />
        {file && (
          <>
            <p className="text-gray-400">Filename: {file.name}</p>
            <p className="text-gray-400">Size: {file.size}</p>
          </>
        )}
      </div>
      <div className="mt-6 relative">
        <label name="nft-name">Name</label>
        <input
          type="text"
          name="nft-name"
          id="nft-name"
          className="w-full rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600"
          placeholder="* Required"
          defaultValue={name}
          onChange={(e) => updateName(e.target.value)}
        />
      </div>
      <div className="mt-6 relative">
        <label name="nft-description">Description</label>
        <input
          type="text"
          name="nft-description"
          id="nft-description"
          className="w-full rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600"
          placeholder="Optional"
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-6 relative">
        <label name="nft-royalties">Royalties</label>
        <input
          type="number"
          name="nft-royalties"
          id="nft-royalties"
          className="w-full rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600"
          placeholder="Royalties"
          defaultValue={royalties}
          onChange={(e) => setRoyalties(e.target.value)}
        />
      </div>
      <div className="mt-6 relative">
        <label name="nft-external-url">External URL</label>
        <input
          type="text"
          name="nft-external-url"
          id="nft-external-url"
          className="w-full rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600"
          placeholder="Optional"
          defaultValue={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
        />
      </div>
      <button
        className="w-full mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
        disabled={disabled}
        onClick={doMint}
      >
        {loading ? (
          <div className="w-[17px] mx-auto">
            <Grid color="#3B82F6" height={17} width={17} />
          </div>
        ) : (
          <span>Create</span>
        )}
      </button>
      {/* <button
        className="w-full mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white mt-2 hover:bg-blue-600 disabled:bg-gray-300"
        onClick={doMintEditions}
      >
        Mint Editions
      </button> */}
    </div>
  );
}
