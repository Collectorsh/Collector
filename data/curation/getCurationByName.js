import apiClient from "../client/apiClient";
import useSWR from 'swr'

async function getCurationByName(username, name) {
  try {
    let res = await apiClient.post("/curation/get_by_name", {
      username: username,
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


async function getCurationDetailsByName({ username, name }) {
  if (!username || !name) return null;
  try {
    let res = await apiClient.post("/curation/get_listings_and_artists_by_name", {
      username: username,
      name: name,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
} 

const fetcher = async (props) => {
  return getCurationDetailsByName(props)
}
export const useCurationDetails = (username, name) => {
  const { data: curation, error } = useSWR({ username, name }, fetcher)
  return curation
}