import React, { useContext, useEffect, useState } from "react";
import UserContext from "/contexts/user";
import { Toaster } from "react-hot-toast";
import { success, error } from "/utils/toastMessages";
import saveUser from "/data/user/saveUser";
import { urlRegex } from "../curations/editNameModal";
import UsernameAndEmail from "../onboarding/UsernameAndEmail";
import MainButton from "../MainButton";
import { Oval } from "react-loader-spinner";


export const usernameError = 'Must be 2 to 31 characters and only contain letters, numbers, "_" and "-"'
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Settings() {
  const [user, setUser] = useContext(UserContext);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const disableSave = error || username?.length < 2 || saving;


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
    } else {
      setError(res?.data?.msg || "An error occurred while saving user settings");
    }

    setSaving(false)
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Profile</p>
        <MainButton
          size="lg"
          className="w-24"
          onClick={handleSave}
          solid
          disabled={disableSave}
        >
          {saving
            ? (
              <span className="inline-block translate-y-0.5">
                <Oval color="#FFF" secondaryColor="#666" height={18} width={18} strokeWidth={2.5}/>
              </span>
            )
            : "Save"
          }
        </MainButton>
      </div>
      <p className="text-sm pl-4 text-red-500 h-4 w-full mt-0 text-center">{error}</p>
      <UsernameAndEmail
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
      />
    </div>
  )
}
