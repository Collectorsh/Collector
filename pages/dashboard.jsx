import { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserContext from "../contexts/user";
import { PLATFORM_AUCTION_HOUSE_1_ADDRESS, adminIDs, connection } from "../config/settings";
import NotFound from "../components/404";
import MainNavigation from "../components/navigation/MainNavigation";
import Datepicker from "react-tailwindcss-datepicker";
import MainButton from "../components/MainButton";
import getSalesHistoryByRange from "../data/salesHistory/getByRange";
import { truncate } from "../utils/truncate";
import clsx from "clsx";
import { roundToPrecision } from "../utils/maths";
import { downloadCSV } from "../utils/csv";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import withdrawFromTreasury, { withdrawFromPlatformTreasury } from "../data/curation/withdrawFromTreasury";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { error, success } from "../utils/toast";
import { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { RoundedCurve } from "../components/curations/roundedCurveSVG";
import { adminGetAllCuratorCurations } from "../data/curation/adminGetAllCurations";
import useCurationAuctionHouse from "../hooks/useCurationAuctionHouse";
import { shootConfetti } from "../utils/confetti";
import { getWaitlistSignups } from "../data/waitlist_signups/getAllSignups";
import CopyButton from "../components/CopyToClipboard";
import { approveWaitlistSignup } from "../data/waitlist_signups/approveSignup";
import * as Icon from "react-feather";
import { getHighlightedCurations, saveHighlightedCurations } from "../data/curation/getHighlightedCurations";
import SearchBar from "../components/SearchBar";
import { searchCurationsByName } from "../data/curation/getCurationByName";
import debounce from "lodash.debounce";


const tabs = ["Stats", "Fees", "Waitlist", "Curation Highlights"];

export default function Dashboard() { 
  const [user] = useContext(UserContext);
  const wallet = useWallet();

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [dateRange, setDateRange] = useState({
    startDate: firstDayOfMonth,
    endDate: currentDate,
  })

  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [artistUsername, setArtistUsername] = useState("");
  const [collectorUsername, setCollectorUsername] = useState("");
  const [curationName, setCurationName] = useState("");
  const [waitlist, setWaitlist] = useState([])

  const [curations, setCurations] = useState([]);

  const [collectedFees, setCollectedFees] = useState(0)

  const [highlightedCurations, setHighlightedCurations] = useState([])
  const [curationSearch, setCurationSearch] = useState("")
  const [searchedCurations, setSearchedCurations] = useState([])

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(49);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const isAdmin = adminIDs.includes(user?.id)

  useEffect(() => {
    const fetchCurations = async () => {
      const featured = await getHighlightedCurations()
      if (featured) setHighlightedCurations(featured)
    }
    fetchCurations()
  }, [])

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      if (!currentTab) return
      setTabUnderlineLeft(currentTab.offsetLeft);
      setTabUnderlineWidth(currentTab.clientWidth);
    }
    setTimeout(setTabPosition(), 100)
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  useEffect(() => { 
    if (!isAdmin) return;
    (async () => {
      if (!wallet) return;

      const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));
  
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(PLATFORM_AUCTION_HOUSE_1_ADDRESS) });
  
      const balanceLamports = await connection.getBalance(new PublicKey(auctionHouse.treasuryAccountAddress));
      const balance = balanceLamports / LAMPORTS_PER_SOL;
      setCollectedFees(balance)
    })()
  }, [wallet, isAdmin])

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const curations = await adminGetAllCuratorCurations(user.api_key)
      setCurations(curations)
    })();
  }, [isAdmin, user])


  useEffect(() => { 
    if (!isAdmin) return;
    (async () => {
      const wl = await getWaitlistSignups()
      setWaitlist(wl.sort(signup => signup.user.subscription_level !== "pro" ? -1 : 1))
    })()
  }, [isAdmin])

  const handleFetch = async () => { 
    if(!isAdmin) return
    setFetching(true);
    setRecords([]);
    const records = await getSalesHistoryByRange({
      apiKey: user.api_key,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      artistUsername,
      collectorUsername,
      curationName,
    })
    if (records) setRecords(records);
    setFetching(false);
  }

  const handleDownload = () => {
    if (!isAdmin) return
    // format records
    const formattedRecords = records?.map(record => { 
      const { date, artistName, sellerName, collectorName, curatorName, saleType, curationName, curatorAddress } = getDetailsFromRecord(record);
      return {
        Date: date,
        Title: record.token_name,
        Sale_Amount: Number(record.price),
        Type: saleType,
        Curation: curationName,
        Artist: artistName,
        Artist_Address: record.artist_address,
        Seller: sellerName,
        Seller_Address: record.seller_address,
        Collector: collectorName,
        Collector_Address: record.buyer_address,
        Curator: curatorName,
        Curator_Address: curatorAddress,
      }
    })
    downloadCSV(formattedRecords, `Curation_Sales-${new Date(dateRange.startDate).toLocaleDateString()}_to_${new Date(dateRange.endDate).toLocaleDateString()}`)
  }

  const handleWithdrawFees = async () => {
    if (!isAdmin) return

    setFetching(true)
    const res = await withdrawFromPlatformTreasury()

    if (res?.status === "success") {
      success(`Successfully withdrew ${ roundToPrecision(collectedFees, 3) } SOL!`)
      setCollectedFees(0)
    } else {
      error(`Withdrawal failed`)
    }
    setFetching(false)
  }

  const handleSaveHighlights = async () => {
    setFetching(true)
    const ids = highlightedCurations.map(c => c.id)
    const res = await saveHighlightedCurations(ids, user.api_key)

    if (res?.status === "success") {
      success("Successfully saved highlights")
    } else {
      error("Failed to save highlights")
    }
    setFetching(false)
  }

  
  useEffect(() => {
    if (!curationSearch) return
    if (!isAdmin) return
    const handleCurationSearch = async () => { 
      setFetching(true)
      const res = await searchCurationsByName(curationSearch.replaceAll(" ", "_"))
      if (res.error) error("Failed to search")
      else setSearchedCurations(res)
      setFetching(false)
    }
  
    handleCurationSearch()
  } , [curationSearch, isAdmin])

  const { totalSales, uniqueArtists, uniqueCollectors } = useMemo(() => {
    let totalSales = 0;
    const uniqueArtistNames = new Set();
    const uniqueCollectorNames = new Set();
    records?.forEach(record => {
      totalSales += Number(record.price);
      uniqueArtistNames.add(record.artist ? record.artist.username : truncate(record.artist_address));
      uniqueCollectorNames.add(record.buyer ? record.buyer.username : truncate(record.buyer_address));
    })

    return {
      totalSales,
      uniqueArtists: uniqueArtistNames.size,
      uniqueCollectors: uniqueCollectorNames.size,
    }
  }, [records])

  if (!isAdmin) return <NotFound />

  const stats = (
    <>
      <div className="flex justify-center items-center gap-5 w-fit mx-auto m-4">
        <div className="border-2 rounded-md min-w-[18rem] ">
          <Datepicker
            inputClassName={(cl) => clsx("font-[bold_!important]", cl)}
            separator={"to"} 
            displayFormat={"MM/DD/YYYY"} 
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
          />
        </div>
        <MainButton
          className="flex-shrink-0"
          onClick={handleFetch}
          disabled={fetching}
        >
          Get them stats!
        </MainButton>
        <MainButton
          className="flex-shrink-0"
          onClick={handleDownload}
          disabled={!records.length}
        >
          Download them stats! (CSV)
        </MainButton>

      </div>
      <div className="flex flex-wrap justify-center gap-3">
        
          <input
            placeholder="Artist Username"
            value={artistUsername}
            onChange={(e) => setArtistUsername(e.target.value)}
            className="my-0 border-2 rounded
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        px-3"
          />
          <input
            placeholder="Collector Username"
            value={collectorUsername}
            onChange={(e) => setCollectorUsername(e.target.value)}
            className="my-0 border-2 rounded
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        px-3"
          />
          <input
            placeholder="Curation Name"
            value={curationName}
            onChange={(e) => setCurationName(e.target.value)}
            className="my-0 border-2 rounded
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        px-3"
          />
      

      </div>

      <div className="flex justify-center gap-5 items-center my-5">
        <Stat title="Total Sales (SOL)" stat={roundToPrecision(totalSales, 2)} />
        |
        <Stat title="# of Unique Artists" stat={uniqueArtists} />
        |
        <Stat title="# of Unique Collectors" stat={uniqueCollectors} />
      </div>


      <div className="sticky grid grid-cols-9 top-20 bg-white dark:bg-black">
        <TableHeader>Date</TableHeader>
        <TableHeader>Title</TableHeader>
        <TableHeader>Sale Amount</TableHeader>
        <TableHeader>Type</TableHeader>
        <TableHeader>Curation</TableHeader>
        <TableHeader>Artist</TableHeader>
        <TableHeader>Seller</TableHeader>
        <TableHeader>Collector</TableHeader>
        <TableHeader>Curator</TableHeader>
      </div>
      <div className="grid grid-cols-9">
        
        {
          records.length
            ? records.map((record) => <RecordRow key={record.id} record={record} />)
            : null
        }
      </div>
    </>
  )

  const fees = (
    <>
      <div className="mx-auto text-center mt-2">
        <p>Platform Fees (Artist & Collector Curations): {collectedFees} SOL</p>
        <MainButton
          solid
          onClick={handleWithdrawFees}
          className="mt-2"
          disabled={fetching || !collectedFees}
        >
          {fetching ? (
            <Oval color="#FFF" secondaryColor="#666" height={20} width={20} />
          ) : "Withdraw Fees"}

        </MainButton>

        {curations.map(curation => <CurationItem key={curation.id} curation={curation} />)}
      </div>
    </>
  )
  const waitlistTable = (
    <>
      <p className="text-center text-2xl font-bold mb-5">Total - {waitlist?.length}</p>
      <p className="text-center text-2xl font-bold mb-5">Approved - {waitlist?.filter(signup => signup.user.subscription_level === "pro").length}</p>
      {waitlist?.map(signup => <SingupItem key={signup.id} signup={signup} setWaitlist={setWaitlist} />)}
    </>
  )

  const curationHighlights = (
    <>
      <p className="text-2xl text-center font-bold">
        Currently highlighted
      </p>
      <p className="text-sm textPalette2 text-center">Only the first four will show</p>
      <div className="border-2 borderPalette1 rounded-md grid grid-cols-4 place-items-center">
        {highlightedCurations.map(curation => <CurationHighlightItem
          key={curation.id}
          curation={curation}
          onClick={() => {
            setHighlightedCurations(prev => prev.filter(c => c.id !== curation.id))
          }}
        />)}
      </div>
      <MainButton
        onClick={handleSaveHighlights}
        size="lg"
        className="mx-auto my-4 block"
        disabled={fetching}
      >
        Save
      </MainButton>   
      <hr className="border-neutral-200 dark:border-neutral-800 my-4" />
      <SearchBar
        className="w-56 mx-auto my-4"
        search={curationSearch}
        setSearch={(search) => setCurationSearch(search)}
        placeholder="Search curations"
      />
      <div className="border-2 borderPalette1 rounded-md grid grid-cols-4 place-items-center">
        {searchedCurations.length
          ? searchedCurations.map(curation => <CurationHighlightItem
          key={curation.id}
          curation={curation}
          onClick={() => {
            setHighlightedCurations(prev => [...prev, curation])
          }}
          />)
          : (
            <p className="text-center textPalette2 col-span-4">No results</p>
          )}
      </div>
    </>
  )

  const content = [stats, fees, waitlistTable, curationHighlights];


  return (
    <>
      <MainNavigation />
      <Toaster />
      <div className="max-w-screen-2xl mx-auto p-5 min-w-[1210px]">
        <h1 className="text-4xl text-center">Admin Dashboard</h1>
       
        <div className="relative mx-auto w-fit">
          <div className="flex justify-center space-x-2 border-b-8 border-neutral-200 dark:border-neutral-700">
            {tabs.map((tab, i) => {
              const handleClick = () => {
                setActiveTabIndex(i);
              }
              const isSelected = activeTabIndex === i;

              // if(i === 0 && !activeTabIndex) setActiveTabIndex(0)

              return (
                <button
                  key={tab}
                  ref={(el) => (tabsRef.current[i] = el)}
                  className={clsx(
                    "px-3 py-1 capitalize hover:opacity-100 hover:scale-[102%] font-bold duration-300",
                    isSelected ? "border-black dark:border-white opacity-100" : "border-transparent opacity-75")}
                  onClick={handleClick}
                >
                  {tab}
                </button>
              )
            })}

          </div>
          <RoundedCurve className="absolute bottom-0 -left-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700 transform scale-x-[-1]" />
          <RoundedCurve className="absolute bottom-0 -right-5 w-5 h-2 fill-neutral-200 dark:fill-neutral-700" />
          <span
            className="absolute rounded-full bottom-0 block h-1 w-full shadow-inner shadow-black/10 dark:shadow-white/10"
          />
          <span
            className="absolute rounded-full bottom-0 block h-1 bg-black dark:bg-white transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
        </div>
        <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />
        {content[activeTabIndex]}

      </div>
    </>
  )
}

const Stat = ({ title, stat }) => {
  return (
    <div className="flex gap-2 items-center">
      <p className="text-xl">{title}:</p>
      <p className="text-xl font-bold">{stat}</p>
    </div>
  )
}

const TableHeader = ({ children }) => { 
  return (
    <p className="font-bold text-lg border-b-4 border-x p-2">
      {children}
    </p>
  )
}

const TableCell = ({ children, tippyContent }) => { 
  const handleClick = () => {
    if (!tippyContent) return;
    navigator.clipboard.writeText(tippyContent);
  }
  return (
    <Tippy content={tippyContent} className="align-start shadow-md min-w-fit" disabled={!tippyContent}>
      <p onClick={handleClick} className={clsx("truncate border-b py-1 px-2", tippyContent && "cursor-pointer")}>
        {children}
      </p>
    </Tippy>
  )
}

const getDetailsFromRecord = (record) => { 
  const date = new Date(record.created_at).toLocaleDateString();
  const artistName = record.artist?.username ?? truncate(record.artist_address);
  const sellerName = record.seller?.username ?? truncate(record.seller_address);
  const collectorName = record.buyer?.username ?? truncate(record.buyer_address);

  const curatorName = record.curation?.curator?.username ?? "N/A"
  const saleType = record.sale_type.replaceAll("_", " ");
  const curationName = record.curation.name.replaceAll("_", " ");
  const curatorAddress = record.curation.curator.public_keys[0]
  return {date, artistName, sellerName, collectorName, curatorName, saleType, curationName, curatorAddress}
}

const RecordRow = ({ record }) => { 
  const { date, artistName, sellerName, collectorName, curatorName, saleType, curationName, curatorAddress } = getDetailsFromRecord(record);
  return (
    <>
      <TableCell>{date}</TableCell>
      <TableCell>{record.token_name}</TableCell>
      <TableCell>{roundToPrecision(record.price, 5)}◎</TableCell>
      <TableCell>{saleType}</TableCell>
      <TableCell>{curationName}</TableCell>
      <TableCell tippyContent={record.artist_address}>{artistName}</TableCell>
      <TableCell tippyContent={record.seller_address}>{sellerName}</TableCell>
      <TableCell tippyContent={record.buyer_address}>{collectorName}</TableCell>
      <TableCell tippyContent={curatorAddress}>{curatorName}</TableCell>
    </>
  )
}

const CurationItem = ({ curation }) => {
  const { collectedFees, setCollectedFees } = useCurationAuctionHouse(curation)
  const [withdrawing, setWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    setWithdrawing(true)
    const res = await withdrawFromTreasury({
      privateKeyHash: curation.private_key_hash,
      curation,
    })

    if (res?.status === "success") {
      success(`Successfully withdrew ${ roundToPrecision(collectedFees.curatorBalance, 4) } SOL!`)
      setCollectedFees({
        curatorBalance: 0,
        platformBalance: 0
      })
      shootConfetti(2)
    } else {
      error(`Withdrawal failed`)
    }
    setWithdrawing(false)
  }
  return (
    <div className="flex items-center gap-5 border-b py-2">
      <p className="text-lg font-bold">{curation.name.replaceAll("_", " ")}</p>
      <p>by {curation.curator.username}</p>
      {/* <p className="text-sm">({curation.curator_fee}%)</p> */}
      <p>{roundToPrecision(collectedFees.platformBalance, 3)} SOL</p>

      <MainButton
        disabled={withdrawing}
        noPadding
        className="px-2"
        onClick={handleWithdraw}
      >
        {withdrawing ? (
          <Oval color="#FFF" secondaryColor="#666" height={20} width={20} />
        ): "Withdraw"}
   
      </MainButton>
    </div>
  )
}

const SingupItem = ({ signup, setWaitlist }) => { 
  const [user] = useContext(UserContext);
  const [approving, setApproving] = useState(false)

  const approved = signup.user.subscription_level === "pro"

  const handleApprove = async () => {
    setApproving(true)
    const res = await approveWaitlistSignup({
      apiKey: user.api_key,
      signupUserId: signup.user.id
    })

    if (res.success) {
      success(`${ signup.user.username } has been approved!`)
      setWaitlist(prev => prev.map(s => s.id === signup.id ? {
        ...s,
        user: {
          ...s.user,
          subscription_level: "pro",
        }
      } : s))
    } else {
      error("Approval failed")
    }
    setApproving(false)
  }
  return (
    <div key={signup.id} className="grid grid-cols-5 border-b-2 borderPalette2 items-center p-4">
      <p>{signup.user.username || "no username"}</p>
      <p className="flex gap-1">
        {signup.email}
        <CopyButton text={signup.email} />
      </p>
      <p>
        <a href={`https://twitter.com/${ signup.twitter_handle }`} target="_blank" rel="noreferrer" className="p-1 rounded-md hoverPalette1">
          @{signup.twitter_handle}
        </a>
      </p>
      <p className="whitespace-pre-line text-xs textPalette2">{signup.more_info}</p>

      {approved ? (
        <Icon.Check color="green" strokeWidth={3} className="mx-auto"/>
      ): (
        <MainButton
          disabled={approving}
          onClick={handleApprove}
          solid
          className="flex items-center justify-center"
        >
          {approving
            ? <Oval color="#FFF" secondaryColor="#666" height={20} width={20} strokeWidth={2.5}/>
            : "Approve"
          }
        </MainButton>
      )}
    </div>
  )
}

const CurationHighlightItem = ({ curation, onClick }) => {
  return (
    <button className="rounded-md hoverPalette1 px-2 py-1" onClick={onClick}>
      <p>
        <span className="font-bold">{curation.name.replaceAll("_", " ")}</span> by {curation.curator.username}
      </p>
    </button>
  )
}