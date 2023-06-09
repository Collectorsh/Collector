import { useEffect, useState } from "react";
import apiClient from "/data/client/apiClient";
import useSWR from 'swr'
import { set } from "nprogress";

async function getAllGalleries(page = 1, perPage = 30, search) {
  try {
    const withSearch = search ? `&search=${search}` : "";
    const response = await apiClient.post(`/galleries/get_all?page=${page}&per_page=${perPage}${withSearch}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export function useAllGalleries(page = 1, perPage = 30, search) {
  const withSearch = search ? `&search=${ search }` : "";
  const getAllUrl = `/galleries/get_all?page=${ page }&per_page=${ perPage }${ withSearch }`;

  const fetcher = url => apiClient.post(url).then(res => res.data)
  const { data, error } = useSWR(getAllUrl, fetcher)
  const [total, setTotal] = useState()
  const { galleries } = data || { galleries: null }

  useEffect(() => {
    if(data) setTotal(data.total)
  }, [data])

  return {galleries, total}
}

export default getAllGalleries;
