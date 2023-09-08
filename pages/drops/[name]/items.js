import { useRouter } from "next/router";
import Nft from "./nft";
import { useEffect } from "react";
import NotFound from "../../../components/404";

export default function Items({ items }) {
  return <NotFound />
  return (
    <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
      {items && items.map((mint, index) => <Nft mint={mint} key={index} />)}
    </div>
  );
}
