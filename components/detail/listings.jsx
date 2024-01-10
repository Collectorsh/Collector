import Tippy from "@tippyjs/react"
import useCurationAuctionHouse from "../../hooks/useCurationAuctionHouse"
import MainButton from "../MainButton"
import { Oval } from "react-loader-spinner"
import UserContext from "../../contexts/user";
import { useContext, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { roundToPrecision } from "../../utils/maths";

export default function DetailListings({ curation, mint }) {
  const [user] = useContext(UserContext);
  const { handleCollect } = useCurationAuctionHouse(curation)
  const [purchasing, setPurchasing] = useState(false)
  const listingToken = curation.submitted_token_listings?.find(l => l.mint === mint)

  if (!listingToken) return null

  //if the curation is an artist curation, and the listing is not by the artist,
  //don't show the listing, it will already be listed under the collector curation
  const isSecondaryOnArtistCuration = curation.curation_type === "artist" && curation.curator_id !== listingToken.owner_id

  if (isSecondaryOnArtistCuration) return null 

  const isListed = listingToken.listed_status === "listed"
  const isSold = listingToken.listed_status === "sold" || listingToken.listed_status === "master-edition-closed"

  const price = roundToPrecision(Number(listingToken.buy_now_price), 3)
  const handleBuy = async (e) => {
    if (!handleCollect || !user) return;

    setPurchasing(true)
    await handleCollect(listingToken)
    setPurchasing(false)
  }

  return (
    <div className="flex flex-wrap justify-between gap-2 items-center">
      <Link href={`/curations/${curation.name}`}>
        <a className="hover:scale-105 duration-300">
          <p className="font-bold text-xl">{curation.name.replaceAll("_", " ")}</p>
          <p>Curated by {curation.curator.username}</p>
        </a>
      </Link>
      {isListed
        ? (
          <Tippy
            content="Connect your wallet first!"
            className="shadow-lg"
            disabled={Boolean(user)}
          >
            <div>
              <MainButton
                onClick={handleBuy}
                className={clsx("px-3 min-w-[10rem]" )}
                noPadding
                disabled={!handleCollect || purchasing || !user}
              >
                {purchasing
                  ? (
                    <span className="inline-block translate-y-0.5">
                      <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
                    </span>
                  )
                  : `Collect (${ price}◎)` 
                }
              </MainButton>
            </div>
          </Tippy>
        )
        : <MainButton className="px-3" noPadding disabled>
          {isSold ? "Sold!" : "Currently Unlisted"}
        </MainButton>
      }    
    </div>
  )
}