import { useEffect } from "react";
import { useRouter } from "next/router";
import NotFound from "../components/404";


const Submissions = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace("/submit")
  }, [router])

  return <NotFound />
}

export default Submissions