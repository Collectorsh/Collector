import { Toaster } from "react-hot-toast";
import MainNavigation from "../components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import { getWaitlistSignupById } from "../data/waitlist_signups/getAllSignups";
import { shootConfetti } from "../utils/confetti";
import MainButton from "../components/MainButton";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import clsx from "clsx";
import { emailRegex } from "../components/settings/Settings";
import { twitterHandleRegex } from "../components/curatorProfile/editSocialsModal";
import { createWaitlistSignup } from "../data/waitlist_signups/createSignup";
import { Oval } from "react-loader-spinner";
import { error } from "../utils/toast";
import CloudinaryImage from "../components/CloudinaryImage";
import { displayName } from "../utils/displayName";
import SvgCurve from "../components/svgCurve";
import { useRouter } from "next/router";
import { collectorBobId } from "../config/settings";

export default function WaitlistPage() {
  const [user] = useContext(UserContext);
  const router = useRouter();
  const {setVisible} = useWalletModal()

  const [signup, setSignup] = useState(null);

  const [email, setEmail] = useState(user?.email || "");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [moreInfo, setMoreInfo] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    user_id: null,
    email: null,
    twitterHandle: null,
    moreInfo: null,
    username: null,
  });

  const isApproved = user?.subscription_level === "pro";

  useEffect(() => { 
    if (user) {
      setErrors(prev => ({
        ...prev,
        user_id: null,
        username: Boolean(user.username) ? null : "Please add a username before applying for the waitlist. Go to Settings (gear icon) in the Menu",
      }))

      if (!email) setEmail(user.email || "")
    }

    (async () => {
      if (user?.id) { 
        const signup = await getWaitlistSignupById({ userId: user.id });
        if (signup) setSignup(signup);
      }
    })()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSubmit = async () => { 
    let valid = true;
    if (!user?.id) {
      setErrors(prev => ({
        ...prev,
        user_id: "Please connect your wallet to sign in before applying for the waitlist",
      }))
      valid = false;
    }

    if (!user?.username) { 
      setErrors(prev => ({
        ...prev,
        username: "Please add a username before applying for the waitlist. Go to Settings (gear icon) in the Menu",
      }))
      valid = false;
    }

    if (email && !emailRegex.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: "Please use a valid email",
      }))
      valid = false;
    }

    if (!twitterHandleRegex.test(twitterHandle)) {
      setErrors(prev => ({
        ...prev,
        twitterHandle: "Please use a valid twitter handle",
      }))
      valid = false;
    }

    if (valid) { 
      setSubmitting(true)
      const res = await createWaitlistSignup({
        userId: user.id,
        email,
        twitterHandle,
        moreInfo,
      })

      if (res.error) {
        error(res.error)
      } else {
        setSignup(res)
        shootConfetti(2)
      }
    }
    setSubmitting(false)
  }

  const handleEmailChange = (e) => { 
    setEmail(e.target.value)
    setErrors(prev => ({
      ...prev,
      email: null,
    }))
  }

  const handleHandleChange = (e) => { 
    setTwitterHandle(e.target.value)
    setErrors(prev => ({
      ...prev,
      twitterHandle: null,
    }))
  }

  const handleTwitterShare = () => {

  }

  const handleGetStarted = () => { 
    router.push(`/gallery/${ user.username }`)
  }

  const form = (
    <>
      <p className="font-bold text-4xl md:text-5xl text-center mb-8">
        {user?.username ? `${ displayName(user) }, j` : "J"}oin the waitlist!
      </p>
      <div className="max-w-sm w-full mx-auto">
    
        <p className="font-bold text-lg ml-4 mt-2">Twitter Handle</p>
        <div className={clsx("my-1 border-2 rounded-lg w-full px-4 py-2", "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800", "flex gap-1 items-center")}>
          <p className="textPalette2 text-sm">@</p>
          <input
            className={clsx("bg-transparent outline-none w-full")}
            onChange={handleHandleChange}
            value={twitterHandle}
            placeholder="Twitter Handle"
          />
        </div >
     
        <p className="font-bold text-lg ml-4 mt-2">Email <span className="text-sm textPalette2">(optional)</span></p>
        <input
          className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800")}
          onChange={handleEmailChange}
          value={email}
          placeholder="Email"
        />
     
        <p className="font-bold text-lg ml-4 mt-2">Additional Info <span className="text-sm textPalette2">(optional)</span></p>
        <textarea
          className={clsx("my-1 border-2 rounded-lg outline-none w-full px-4 py-2", "bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800")}
          onChange={(e) => setMoreInfo(e.target.value)}
          value={moreInfo}
          placeholder="Any additional information you'd like to share?"
        />
        {Object.values(errors).filter(Boolean).map((error, i) => <p key={i} className="text-red-500">{error}</p>)}
        <MainButton
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-6 flex justify-center items-center"
          size="lg"
          solid
          >
          {submitting
            ? <Oval color="#FFF" secondaryColor="#666" height={22} width={22} strokeWidth={2.5}/>
            : "Submit!"
          }
        </MainButton>
      </div>
    </>
  )

  const notLoggedIn = (
    <div className="text-center">
      <p className="font-bold text-4xl md:text-5xl text-center mb-8">
        Join the waitlist!
      </p>
      <MainButton
        onClick={() => setVisible(true)}
        className="m-auto mt-4"
        size="lg"
      >
        Connect Wallet
      </MainButton>
    </div>
  )

  const waiting = (
    <div className="text-center">
      <p className="font-bold text-4xl md:text-5xl text-center mb-8">
        {displayName(user) || "..." }, you are on the waitlist!
      </p>
      <p className="textPalette2">We will reach out to you in 2-4 weeks!</p>

    </div>
  )

  const approved = (
    <div className="text-center">
      <p className="font-bold text-4xl md:text-5xl text-center mb-4 md:mb-8">
        Congrats {displayName(user) || "..."}, <br /> you have been approved!
      </p>
      <p className="textPalette2">Enjoy using Collector!</p>

      <div className="flex flex-wrap-reverse gap-x-6 gap-y-3 mt-8 md:mt-16 items-center justify-center">
        <MainButton
          onClick={handleTwitterShare}
          size="lg"
          className="w-[12.25rem]"
        >
          Share to Twitter
        </MainButton>
        <MainButton
          onClick={handleGetStarted}
          size="lg"
          solid
          className="w-[12rem]"
        >
          Get Started!
        </MainButton>
      </div> 
    </div>
  )

  const usingForm = user && !isApproved && !signup;
  const content = () => {
    if (!user) return notLoggedIn;
    if (isApproved) {
      shootConfetti(3)
      return approved;
    }
    if (signup) return waiting;
    return form;
  }

  return (
    <div>
      <MainNavigation />
      <Toaster />
      <div className="h-[calc(100svh-76px)] relative">
        {/* <SvgCurve
          color="fill-neutral-200 dark:fill-neutral-800"
          position="top-0 left-0"
          flipped
        /> */}
        <div className={clsx(
          "relative px-4 2xl:px-8 flex flex-col justify-center items-center palette1",
          "h-[calc(100%-224px)]",
          usingForm ? "min-h-[600px]" : "min-h-[425px]"
        )} >
          
          <div className="opacity-95 ">
            <CloudinaryImage
              className="w-36 h-36 mx-auto dark:invert object-contain relative -bottom-2"
              id={collectorBobId}
              noLazyLoad
              width={500}
              noLoaderScreen
            />
          </div>
          {content()}  
        </div>
        
      </div>
      {/* <div className="relative">
        <SvgCurve
          color="fill-neutral-200 dark:fill-neutral-800"
        />
      </div> */}
    </div>
  )
}