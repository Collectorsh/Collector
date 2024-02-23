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
import { success } from "../../utils/toast";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { emailRegex, usernameError } from "../settings/Settings";
import { ProfileEmail, ProfileUsername } from "./ProfileInputs";



export default function CreateUsernameModal() {
  const [user, setUser] = useContext(UserContext);
  const wallet = useWallet();

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [usernameSaved, setUsernameSaved] = useState(false) 

  const [stage, setStage] = useState(0);//0 - username/email, 1 - addresses

  const disableSave = error || username?.length < 2 || saving;
  
  useEffect(() => {
    if (!user) setShowModal(false);
    else setShowModal(!user.username)
  }, [user]);

  useEffect(() => {
    if (username?.length < 2) return; //don't set an error when they are beginning to type
    const isUrlValid = urlRegex.test(username);


    if (!isUrlValid) setError(usernameError);
    else setError(null)
    //keep email here so errors reset when retyping email
  }, [username, email])

  const handleSave = async () => {

    //check email
    //no email is also valid
    const isEmailValid = email ? emailRegex.test(email) : true;
    if (!isEmailValid) {
      setError('Must be a valid email address');
      return
    }

    if (disableSave) return;
    setSaving(true)

    const res = await saveUser(user.api_key, {
      username: username,
      email: email,
    });

    if (res.data && res.data.status === "success") {
      setUser({ ...user, ...res.data.user });
      success("User settings saved!");

      setUsernameSaved(true)
      
      //until public access just leave off at username and email
      // setStage(prev => prev + 1);
      setShowModal(false);
    } else {
      setError(res?.data?.msg || "An error occurred while saving user settings");
    }

    setSaving(false)
  }

  const handleClose = () => {
    // if (!usernameSaved) {
    //   //sign out user if they havent saved their username
    //   wallet.disconnect().then(() => {
    //     localStorage.removeItem("api_key");
    //     setUser(null);
    //   });
    // } 

    setShowModal(false)
  }

  const content = () => {
    switch (stage) {
      case 0: return (
        <>
          <p className="text-center my-4">
            Enter your username to finish setting up your account. You can always change this later in your profile settings.
          </p>
          <ProfileUsername
            username={username}
            setUsername={setUsername}
            paletteClass="palette2 borderPalette3"
          />
          <ProfileEmail
            email={email}
            setEmail={setEmail}
            paletteClass="palette2 borderPalette3"
          />
        </>
      )
      case 1: return (
        <>
          <p className="text-center my-4">
            Congrats! you are all set to go.
          </p>
          <p className="text-center my-4">
            Start building your gallery or add more wallets to begin!
          </p>

          <div className="w-full flex justify-center gap-4">
            <Link href={`/gallery/${ username }`} passHref>
              <MainButton solid>
                View Gallery
              </MainButton>
            </Link>
            <Link href="/settings?tab=wallets" passHref>
              <MainButton>
                Add Wallets
              </MainButton>
            </Link>
          </div>
        </>
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

        {content()}
        
        <p className="text-sm pl-4 italic text-red-500 h-4 w-full mt-3 text-center">{error}</p>
        <div className="w-full flex justify-center gap-4 relative mt-2">
          <MainButton
            onClick={handleClose} size="lg" standardWidth
          >
            Close
          </MainButton>
          <Tippy
            className="shadow"
            disabled={username}
            content={<p className="">Username is required</p>}
          >
            <div className={stage === 1 ? "hidden" : ""}>
              <MainButton
                size="lg" standardWidth
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
          </Tippy>
        </div>
      </Modal>
    </>
  )
}
