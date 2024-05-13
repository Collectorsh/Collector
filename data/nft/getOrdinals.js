import axios from "axios";
import { useState } from "react";
import useSWR from 'swr'

async function getOrdinals() {
  return axios.post("/api/nfts/get-ordinals").then((response) => response.data)
}

export default getOrdinals;


export function useOrdinals() {
  // const { data, error } = useSWR("placholder", getOrdinals)
  // console.log("🚀 ~ useOrdinals ~ data:", data)

  const [data, setData] = useState(null)

  useEffect(() => { 
    // getOrdinals().then((data) => {
    //   setData(data)
    // })
  }, [])

  return data
}