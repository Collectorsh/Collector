import apiClient from "../client/apiClient";
import useSWR from 'swr'

async function getCurationByName(name) {
  try {
    let res = await apiClient.post("/curation/get_by_name", {
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getCurationByName;

const fetcher = async (name) => {
  return getCurationByName(name)
}
export const useCuration = (name) => {
  const { data: curation, error } = useSWR(name, fetcher)
  return curation
}