import { useRouter } from "next/router";

import NotFound from "../components/404";
import { useEffect } from "react";

export default function MintPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/mint")
  }, [router])
  
  return <NotFound />
}
