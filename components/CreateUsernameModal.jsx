import React, { useContext, useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import saveUser from "/data/user/saveUser";
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "./Modal";
import MainButton from "./MainButton";
import { Oval } from "react-loader-spinner";
import { urlRegex } from "./curations/editNameModal";

export default function CreateUsernameModal() {
  const [user, setUser] = useContext(UserContext);
  const wallet = useWallet();

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(user?.username || "")

  const disableSave = error || username?.length < 2 || saving;
  
  useEffect(() => {
    if (!user) setShowModal(false);
    else setShowModal(!user.username)
  }, [user]);

  useEffect(() => {
    if (username?.length < 2) return; //don't set an error when they are beginning to type
    const isUrlValid = urlRegex.test(username);
    if (!isUrlValid) setError('Must be 2 to 31 characters and only contain letters, numbers, "_" and "-"');
    else setError(null)
  }, [username])

  const handleSave = async () => {
    if (disableSave) return;
    setSaving(true)
   
    const res = await saveUser(user.api_key, {
      username: username,
    });

    if (res.data && res.data.status === "success") {
      setUser({ ...user, ...res.data.user });
    } else {
      setError(res?.data?.msg || "An error occurred");
    }

    setSaving(false)
  }

  const handleClose = () => {
    wallet.disconnect().then(() => {
      localStorage.removeItem("api_key");
      setUser(null);
    });
    setShowModal(false)
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      title={"Welcome to Collector!"}
      widthClass="max-w-screen-sm"
    >
      <p className="text-center my-4">
        Create a username to finish setting up your account. You can always change this later in your profile settings.
      </p>

      <input
        className="mt-4 border-4 rounded-xl
        border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 
        w-full p-3"
        onChange={(e) => setUsername(e.target.value.replaceAll(" ", "_"))}
        value={username}
        placeholder="Username"
      />
      <p className="text-sm pl-4 italic text-red-500 h-4">{error}</p>

      <div className="w-full flex justify-center gap-4 relative mt-4">
        <MainButton onClick={handleClose}>
          Cancel
        </MainButton>
        <MainButton
          className="w-24"
          onClick={handleSave}
          solid
          disabled={disableSave}
        >
          {saving
            ? (
              <span className="inline-block translate-y-0.5">
                <Oval color="#FFF" secondaryColor="#666" height={18} width={18} />
              </span>
            )
            : "Save"
          }
        </MainButton>
      </div>
    </Modal>
  )
}
