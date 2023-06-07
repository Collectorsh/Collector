import { useRouter } from "next/router";
import Nft from "./nft";

export default function Items({ items }) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/")
  }, [router])

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1>404</h1>
    </div>
  )
  return (
    <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
      {items && items.map((mint, index) => <Nft mint={mint} key={index} />)}
    </div>
  );
}
