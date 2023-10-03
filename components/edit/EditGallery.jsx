import React, { useContext } from "react";
import UserContext from "/contexts/user";
import Gallery from "./dnd/Gallery";
import { useTokens } from "/data/nft/getTokens";

export default function EditGallery() {
  const [user] = useContext(UserContext);
  // const [tokens, setTokens] = useState();
  const tokens = useTokens(user?.public_keys, {
    justVisible: false,
    useArtistDetails: false,
  });

  return (
    <div className="dark:bg-black mt-2 pb-12">
      {tokens && user ? (
        <Gallery tokens={tokens} user={user} />
      ) : (
        <h1 className="animate-pulse font-bold text-4xl text-center mt-[15%]">collect<span className="w-[1.2rem] h-[1.15rem] rounded-[0.75rem] bg-black dark:bg-white inline-block -mb-[0.02rem] mx-[0.06rem]"></span>r</h1>
      )}
    </div>
  );
}
