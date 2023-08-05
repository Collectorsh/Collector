import { useState } from "react";
import Modal from "../Modal";
import MainButton, { WarningButton } from "../MainButton";
import CloudinaryImage from "../CloudinaryImage";
import clsx from "clsx";
import { roundToPrecision } from "../../utils/maths";
import { success } from "../../utils/toast";
import { Oval } from "react-loader-spinner";

const EditSubmissionsModal = ({ submissions, isOpen, onClose, handleEditListing }) => { 
  const handleList = async (token, listingPrice) => {
    //TODO: await list on chain
    //handleEdit list vs update
    function fakeApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("API call completed!");
        }, 1000); // delay for 2 seconds
      });
    }
    await fakeApiCall()

    if (token.isListed) { //based on prev state
      success(`${token.name} listing has been updated!`)
    } else {
      success(`${token.name} has been listed!`)
    }

    const newToken = {
      ...token,
      isListed: true,
      price: parseFloat(listingPrice),
    }

    handleEditListing(newToken)
  }

  const handleUnlist = async (token) => { 
    //TODO: await delist on chain

    function fakeApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("API call completed!");
        }, 500); // delay for 2 seconds
      });
    }
    await fakeApiCall()
    success(`${ token.name } has been delisted`)

    const newToken = {
      ...token,
      isListed: false,
      price: 0,
    }

    handleEditListing(newToken)
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Submission Listings"
    >
      <div className="mt-4 p-4 overflow-auto grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {submissions.map((token) => (
          <Submission
            key={token.mint}
            token={token}
            onList={handleList}
            onUnlist={handleUnlist}
          />
        ))}
      </div>

      <div className="w-full flex justify-end gap-4 mt-4 relative">
        <MainButton onClick={onClose}>
          Close
        </MainButton>
      </div>
    </Modal>
  )
}

export default EditSubmissionsModal;

const Submission = ({ token, onList, onUnlist }) => { 
  const [listing, setListing] = useState(false)
  const [listingPrice, setListingPrice] = useState(token.price)

  const disableListing = !listingPrice || listingPrice <=0 || listingPrice == token.price || listing

  const price = roundToPrecision(token.price, 3)

  const handleList = async () => {
    setListing(true)
    await onList(token, listingPrice)
    setListing(false)
  }
  const handleUnlist = async () => { 
    setListing(true)
    await onUnlist(token)
    setListing(false)
  }

  return (
    <div className="relative h-fit shadow-lg shadow-dark/10 dark:shadow-white/10 rounded-lg">
      <CloudinaryImage
        className={clsx("flex-shrink-0 overflow-hidden object-cover",
          "w-full h-[250px] rounded-t-lg",
        )}
        id={`${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER }/${ token.mint }`}
        mint={token.mint}
        metadata={token}
        width={800}
        useMetadataFallback
      />
      <div className="p-2">
        <h3 className="font-bold text-xl mb-2 px-1">{token.name}</h3>
        {token.isListed
          ? (
            <div className="flex justify-between  items-center flex-wrap mb-2">
              <p className="font-bold px-1">Listed For: {price}◎</p>
              <WarningButton
                onClick={handleUnlist}
                noPadding
                className={clsx("px-3 w-24")}
                disabled={listing}
              >
                Delist
              </WarningButton>
            </div>
          )
          : null
        }
        
        <div className="flex gap-3 w-full">

          <div className="flex w-full items-center border-2 px-3 py-0 rounded-lg border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
            <input
              type="number"
              className="outline-none bg-transparent w-full"
              placeholder="Buy Now Price"
              onChange={(e) => setListingPrice(e.target.value)}
              value={listingPrice}
            />
            <p>◎</p>
          </div>
          <MainButton
            solid
            onClick={handleList}
            disabled={disableListing}
            noPadding
            className={clsx("px-3 w-24 flex-shrink-0")}
          >
            {listing
              ? (
                <span className="inline-block translate-y-0.5">
                  <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                </span>
              )
              : token.isListed ? "Update" : "List!"
            }
          </MainButton>     
    
        </div>
       
      </div>
    </div>
  )
}