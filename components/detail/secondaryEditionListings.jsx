import Tippy from "@tippyjs/react"
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse"
import MainButton from "../MainButton"
import { Oval } from "react-loader-spinner"
import UserContext from "../../contexts/user";
import { useContext, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { roundToPrecision } from "../../utils/maths";
import { InformationCircleIcon } from "@heroicons/react/solid";


export default function SecondaryEditionListings({ editionListings }) {

  const [displayedEditionListings, setDisplayedEditionListings] = useState(editionListings.sort((a, b) => Number(a.buy_now_price) - Number(b.buy_now_price)))
 
  const handleCollect = (mint) => {
    setDisplayedEditionListings(prev => {
      const newDisplayedEditionListings = prev.filter(l => l.mint !== mint)
      return newDisplayedEditionListings
    })
  }
 
  const info = (
    <Tippy
      content="Editions are sold lowest price first"
      className="shadow-lg"
    >
      <InformationCircleIcon className="w-4 inline -mt-2" />
    </Tippy>
  )

  return (
    <div className="flex flex-wrap justify-between gap-2 items-center">
      <div>
        <p className="font-bold text-lg">Secondary Editions</p>
        <p>{displayedEditionListings.length || "None"} available{info}</p>
      </div>
   
      {displayedEditionListings?.length
        ? <EditionListing listing={displayedEditionListings[0]} onCollect={handleCollect} />
        : null
      }
    </div>
  )
}

export const EditionListing = ({ listing, onCollect }) => {
  const [user] = useContext(UserContext);
  const { handleCollect } = useCurationAuctionHouse(listing.curation)
  const [purchasing, setPurchasing] = useState(false)

  const price = roundToPrecision(Number(listing.buy_now_price), 3)

  const handleBuy = async (e) => {
    if (!handleCollect || !user) return;

    setPurchasing(true)
    const success = await handleCollect(listing)
    if (success) onCollect(listing.mint)
    setPurchasing(false)
  }

  return(
    <Tippy
      content="Connect your wallet first!"
      className="shadow-lg"
      disabled={Boolean(user)}
    >
      <div>
        <MainButton
          onClick={handleBuy}
          className={clsx("px-3 min-w-[10rem]")}
          noPadding
          disabled={!handleCollect || purchasing || !user}
        >
          {purchasing
            ? (
              <span className="inline-block translate-y-0.5">
                <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
              </span>
            )
            : `Collect (${ price }◎)`
          }
        </MainButton>
      </div>
    </Tippy>
  )
}