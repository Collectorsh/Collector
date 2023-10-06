import { Toaster } from "react-hot-toast";
import CheckLoggedIn from "../components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";
import { useRouter } from "next/router";
import Link from "next/link";
import MainButton from "../components/MainButton";
import FileDrop from "../components/FileDrop";
import DescriptionForm from "../components/create/description";
import NameForm from "../components/create/name";
import NotFound from "../components/404";

export default function MintPage() {
  const [user] = useContext(UserContext);
  const router = useRouter()

  const [imageFile, setImageFile] = useState(null)
  const [category, setCategory] = useState("image")
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")
  const [error, setError] = useState({})
  
  const isError = Object.values(error).some(v => v)

  useEffect(() => {
    if (!user) return
    if (!user.curator_approved || user.subscription_level !== "pro") router.replace("/");
  }, [user, router])

  const onDrop = (imageFile) => {
    setImageFile(imageFile);
  }
  return (
    <>
      <CheckLoggedIn />
      <MainNavigation />
      <Toaster />
      <div className="relative w-full max-w-screen-2xl mx-auto 2xl:px-8 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 px-4">
          <h2 className="text-5xl font-bold">Create</h2>
          <Link href="/submissions" passHref>
            <MainButton solid>
              Submissions
            </MainButton>
          </Link>
        </div>

        <hr className="mt-6 mb-12 border-neutral-200 dark:border-neutral-800" />

        <div className="h-[50vh] relative px-4">
          <FileDrop onDrop={onDrop} imageClass="object-contain p-2"/>
        </div>

        <div
          className="mt-3 px-4 mx-auto"
        >
          <NameForm name={tokenName} setName={setTokenName} setError={setError} />

          <DescriptionForm description={tokenDescription} setDescription={setTokenDescription} setError={setError}/>
          <p className="font-bold ">Royalties*: </p>  
          <p className="font-bold ">Creators: </p>     
          <p className="font-bold ">Attributes: </p>  
          <p className="font-bold ">isMutable</p>
          <p className="font-bold ">Collection</p>
                  
          <MainButton disabled={isError}>
            Mint!
          </MainButton>
          <div className="h-10">
            {(Object.entries(error).map((e, i) => {
              return <p key={e[0]} className="text-red-500 text-sm my-2 ml-2">{e[1]}</p>
            }))}
          </div>
        </div>

      </div>
    </>
  )
}
