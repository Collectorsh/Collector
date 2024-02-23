import { useRouter } from "next/router";
import { useContext, useCallback, useEffect } from "react";
import UserContext from "/contexts/user";
import getUserFromApiKey from "/data/user/getUserFromApiKey";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CheckLoggedIn({ holder = false }) {
  const [user, setUser] = useContext(UserContext);
  const { publicKey, disconnect } = useWallet();
  const router = useRouter();

  // Fetch the user from api_key in local storage if the user context is missing
  // If we can't fetch the user redirect back to /
  // This navigation and check is included by all dashboard pages
  const asyncGetUser = useCallback(async (apiKey) => {
    let res = await getUserFromApiKey(apiKey);
    setUser(res.user);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) {
      const apiKey = localStorage.getItem("api_key");
      if (!apiKey) router.push("/");
      asyncGetUser(apiKey);
    } else {
      if (holder) {
        if (!user.token_holder) router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
}
