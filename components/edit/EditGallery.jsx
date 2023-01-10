import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "/contexts/user";
import getMetadata from "/data/nft/getMetadata";
import { Oval } from "react-loader-spinner";
import Gallery from "./dnd/Gallery";

export default function EditGallery() {
  const [user, setUser] = useContext(UserContext);
  const [visible, setVisible] = useState();

  const getTokens = useCallback(async (u) => {
    let tokens = await getMetadata(u.public_keys);
    setVisible(tokens);
    // const vis = tokens.filter((t) => t.visible === true);
    // setVisible(vis);
  }, []);

  useEffect(() => {
    if (!user) return;
    getTokens(user);
  }, [user]);

  return (
    <div className="dark:bg-black min-h-screen mt-2">
      {visible ? (
        <Gallery tokens={visible} user={user} />
      ) : (
        <div className="mt-4 w-[50px] mx-auto h-64">
          <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
        </div>
      )}
    </div>
  );
}
