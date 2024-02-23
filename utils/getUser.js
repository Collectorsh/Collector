import { environment } from "/utils/environment";
import getUserFromApiKey from "/data/getUserFromApiKey";
import { signOut } from "/utils/signOut";

export const getUser = async () => {
  try {
    let apiKey = localStorage.getItem(environment + "_api_key");
    const res = await getUserFromApiKey(apiKey);
    return res;
  } catch (err) {
    console.log(err);
    signOut();
  }
};
