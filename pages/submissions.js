import { useEffect } from "react";
import { useRouter } from "next/router";


const Submissions = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace("/submit")
  }, [router])

  return <NotFound />
}

export default Submissions