import apiClient from "/data/client/apiClient";
import useSWR from 'swr'

async function getCuratorFromUsername(username) {
  try {
    let res = await apiClient.post("/user/get_curator_by_username", {
      username: username,
    });
    return res.data.curator;
  } catch (err) {
    console.log(err);
  }
}

export default getCuratorFromUsername;

const fetcher = async (username) => {
  if (!username) return undefined
  return await getCuratorFromUsername(username)
}
export function useCuratorFromUsername(username) {
  const { data, error } = useSWR(username, fetcher)
  return data
}