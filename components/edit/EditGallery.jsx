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
    const vis = tokens.filter((t) => t.visible === true);
    setVisible(vis);
  }, []);

  useEffect(() => {
    if (!user) return;
    getTokens(user);
  }, [user]);

  return (
    <div className="dark:bg-black min-h-screen mt-2">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <h2 className="bg-gray-100 w-full uppercase rounded p-2 text-center mb-2">
            Settings
          </h2>
        </div>
        <div className="col-span-7 col-end-13">
          <h2 className="bg-gray-100 w-full uppercase rounded p-2 text-center mb-2">
            Visible
          </h2>
          {visible ? (
            <Gallery tokens={visible} user={user} />
          ) : (
            <div className="mt-4 w-[50px] mx-auto h-64">
              <Oval color="#fff" secondaryColor="#000" height={50} width={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
