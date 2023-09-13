import apiClient from "/data/client/apiClient";
import useSWR from 'swr'

async function getUserFromUsername(username) {
  try {
    let res = await apiClient.post("/user/from_username", {
      username: username,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export default getUserFromUsername;


const fetcher = async (username) => {
  if (!username) return undefined
  return await getUserFromUsername(username)
}
export function useUserFromUsername(username) {
  const { data, error } = useSWR(username, fetcher)
  return data
}