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

export async function searchCurationsByName(name) {
  try {
    let res = await apiClient.post("/curation/search_by_name", {
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}


async function getCurationDetailsByName(name) {
  try {
    let res = await apiClient.post("/curation/get_listings_and_artists_by_name", {
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
} 

const fetcher = async (name) => {
  return getCurationDetailsByName(name)
}
export const useCurationDetails = (name) => {
  const { data: curation, error } = useSWR(name, fetcher)
  return curation
}