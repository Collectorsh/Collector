import React, { useContext, useState, Fragment, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import UserContext from "/contexts/user";
import saveUser from "/data/user/saveUser";
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "../Modal";
import MainButton from "../MainButton";
import { Oval } from "react-loader-spinner";
import { urlRegex } from "../curations/editNameModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import UsernameAndEmail from "./UsernameAndEmail";
import AdditionalAddresses from "./AdditionalAddresses";
import { success } from "../../utils/toast";
import { Toaster } from "react-hot-toast";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameError = 'Must be 2 to 31 characters and only contain letters, numbers, "_" and "-"'

export default function CreateUsernameModal() {
  const [user, setUser] = useContext(UserContext);
  const wallet = useWallet();

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [addresses, setAddresses] = useState(user?.public_keys || [])

  const [stage, setStage] = useState(0);//0 - username/email, 1 - addresses

  const disableSave = error || username?.length < 2 || saving;
  
  useEffect(() => {
    // if (user) {
    //   setUsername(user.username);
    //   setEmail(user.email);
    //   setAddresses(user.public_keys);
    //   setShowModal(true);
    // }
    // return

    if (!user) setShowModal(false);
    else setShowModal(!user.username)
  }, [user]);

  useEffect(() => {
    if (username?.length < 2) return; //don't set an error when they are beginning to type
    const isUrlValid = urlRegex.test(username);


    if (!isUrlValid) setError(usernameError);
    else setError(null)
  }, [username, email])

  const handlePrev = () => { 
    if (stage === 1) setStage(prev => prev - 1)
  }

  const handleSave = async () => {
    // if (stage === 0) { 
    //   //check email
    //   //no email is also valid
    //   const isEmailValid = email ? emailRegex.test(email) : true;
    //   if (!isEmailValid) setError('Must be a valid email address');
    //   else setStage(prev => prev + 1);

    //   return
    // }

    //stage 1, no next stage so save

    if (disableSave) return;
    setSaving(true)

    const res = await saveUser(user.api_key, {
      username: username,
      email: email,
    });

    if (res.data && res.data.status === "success") {
      setUser({ ...user, ...res.data.user });
      success("User settings saved!");
      setShowModal(false);
    } else {
      setError(res?.data?.msg || "An error occurred while saving user settings");
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

  const nextText = "Save"//stage === 1 ? "Save" : "Next";

  const content = () => {
    switch (stage) {
      case 0: return (
        <UsernameAndEmail
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
        />
      )
      case 1: return (
        <AdditionalAddresses
          addresses={addresses}
          setAddresses={setAddresses}
        />
      )
    }
  }

  return (
    <>
      <Toaster />
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={"Welcome to Collector!"}
        widthClass="max-w-screen-sm"
      >
        <p className="text-center my-4">
          Finish setting up your account. You can always change this info later in your profile settings.
        </p>

        {content()}
        
        <p className="text-sm pl-4 italic text-red-500 h-4 w-full mt-3 text-center">{error}</p>
        <div className="w-full flex justify-center gap-4 relative mt-2">
          <MainButton
            onClick={handlePrev}
            disabled={stage === 0}
          >
            Previous
          </MainButton>
          <Tippy
            className="shadow"
            disabled={username}
            content={<p className="">Username is required</p>}
          >
            <div>
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
                  : nextText
                }
              </MainButton>
            </div>
          </Tippy>
        </div>
      </Modal>
    </>
  )
}
