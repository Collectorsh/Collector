import { useContext, useMemo, useState } from "react";
import UserContext from "../contexts/user";
import { adminIDs } from "../config/settings";
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
export default function Dashboard() { 
  const [user] = useContext(UserContext);

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [dateRange, setDateRange] = useState({
    startDate: firstDayOfMonth,
    endDate: currentDate,
  })
  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(false);
  

  const isAdmin = adminIDs.includes(user?.id)

  const handleFetch = async () => { 
    if(!isAdmin) return
    setFetching(true);
    setRecords([]);
    const records = await getSalesHistoryByRange({
      apiKey: user.api_key,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
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
    downloadCSV(formattedRecords, `Curation_Sales-${dateRange.startDate.toLocaleDateString()}_to_${dateRange.endDate.toLocaleDateString()}`)
  }

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

  return (
    <>
      <MainNavigation />
      <div className="max-w-screen-2xl mx-auto p-5 min-w-[1210px]">
        <h1 className="text-4xl text-center">Admin Dashboard</h1>
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
        <hr className="border-neutral-200 dark:border-neutral-800" />

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
          
          {records.length
            ? records.map((record) => <RecordRow key={record.id} record={record} />)
            : null
          }
        </div>

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
  return (
    <Tippy content={tippyContent} className="align-start shadow-md min-w-fit" disabled={!tippyContent}>
      <p className={clsx("truncate border-b py-1 px-2")}>
        {children}
      </p>
    </Tippy>
  )
}

const getDetailsFromRecord = (record) => { 
  const date = new Date(record.created_at).toLocaleDateString();
  const artistName = record.artist ? record.artist.username : truncate(record.artist_address);
  const sellerName = record.seller ? record.seller.username : truncate(record.seller_address);
  const collectorName = record.buyer ? record.buyer.username : truncate(record.buyer_address);
  const curatorName = record.curation.curator ? record.curation.curator.username : "N/A"
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