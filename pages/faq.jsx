import Link from "next/link";
import Drawer from "../components/Drawer";
import MainNavigation from "../components/navigation/MainNavigation";
import { TwitterIcon } from "../components/SocialLink";
import CloudinaryImage from "../components/CloudinaryImage";
import { collectorBobId } from "../config/settings";
export default function FaqPage() {
  return (
    <>
     <MainNavigation />
      
      <div className = "relative w-full max-w-screen-lg  mx-auto px-6 sm:px-11 pt-12 pb-28" >
        <h2 className="text-5xl font-bold">Frequently Asked Questions</h2>
        <hr className="mt-6 mb-12 borderPalette2" />

        <QuestionAnswer
          question="What is a Collector?"
          answer="Collector is your digital gallery to curate and discover onchain art.
"
        />
        <QuestionAnswer
          question="What is my gallery?"
          answer="Your gallery (aka profile) is your dedicated space on the platform to showcase art. It serves as your personal digital room where the world can view and appreciate your curations."
        />

        <QuestionAnswer
          question="What should I do with my gallery?"
          answer="Fill it with curations! Get creative and add as many curations as you’d like."
        />

        <QuestionAnswer
          question="What is a curation?"
          answer={<>
            <p>Curations on Collector come in three types, allowing for diverse exhibition experiences:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Collector - Showcase artworks you have collected.</li>
              <li>Artist - Showcase artworks you have created.</li>
              <li>Group - Invite artists to submit and showcase their art in a group exhibition.</li>
            </ul>
          </>}
        />

        <QuestionAnswer
          question="Can I list pieces for sale in a curation?"
          answer={<>
            <p>Yes! When editing a curation, you can list any piece for a fixed price sale.</p>
      
            <p className="textPalette3 text-sm">Please note: listings won&apos;t remain active if they also get listed on platforms that freeze nfts or use escrow</p>
          </>}
        />

        <QuestionAnswer
          question="How does listing a Master Edition work?"
          answer="When you list a Master Edition (enabling collectors to mint editions) our smart contract will temporarily hold onto it. You can stop the sale at any time to reclaim the Master Edition as well as the sales generated from the edition mints."
        />

        <QuestionAnswer
          question="Can I mint on Collector?"
          answer={<p>
            Yes! Head to <Link href="/mint" ><a className="underline">our mint page</a></Link> and go crazy!
          </p>}
        />

        <QuestionAnswer
          question="What are onchain collections?"
          answer="Onchain collections group your artwork on the blockchain. This helps any marketplace, now or in the future, recognize and display your work. We suggest onchain collections, but ultimately you have the final decision."
        />
        <QuestionAnswer
          question="What are your fees?"
          answer="Collector charges a 5% platform fee for selling work. Creating new galleries and curations is free. This is to encourage a lively community of art sharing and appreciation."
        />
        <QuestionAnswer
          question="What blockchains do you support?"
          answer="Solana."
        />
        <QuestionAnswer
          question="Can I connect multiple wallets?"
          answer="Yes! You can connect multiple wallets to your account for a seamless experience. Simply head to settings and select 'add wallets' to get started."
        />
        <QuestionAnswer
          question="Can I use a Ledger?"
          answer="Absolutely, we support using a Ledger for added security. Go to settings, add wallets, and then click on the 'using a ledger' box to sign a message. Ledgers can't control your account. You must use a non-Ledger account to sign in and use the site."
        />
        <QuestionAnswer
          question="Is it Collector or Collector SH?"
          answer='It&apos;s simply "Collector." The SH in our website address is silent and not part of our official name. You can refer to us as Collector everywhere.'
        />
        <QuestionAnswer
          question="Who’s the team behind Collector?"
          answer="EV3 & Nate."
        />

        <div className="opacity-95 ">
          <CloudinaryImage
            className="w-32 h-32 md:w-36 md:h-36 dark:invert object-contain mt-20 mb-6"
            id={collectorBobId}
            noLazyLoad
            width={500}
            noLoaderScreen
          />
        </div>
        <p className="text-4xl font-bold mb-4">
          Couldn&apos;t find your question?
        </p>

        <p className="textPalette2 text-xl">If your question wasn&apos;t addressed here, please let us know!</p>
        <br />
      
        <p className="textPalette2 text-xl">We&apos;re constantly looking to improve our FAQ. Drop us a message on <a href="https://twitter.com/collector_sh" target="_blank" rel="noreferrer" className="underline">Twitter</a> with your question or feedback. Your input helps us serve you better!</p>
        <a href="https://twitter.com/collector_sh" target="_blank" rel="noreferrer" className="hoverPalette2 rounded-full p-1.5 block w-fit mt-2">
          <TwitterIcon className="w-5 h-5" />
        </a>
      </div>
    </>
  )
}

const QuestionAnswer = ({ question, answer }) => {
  return (
    <>
      <Drawer
        title={question}
        buttonClass={"text-2xl text-left"}
      >
        <div className="textPalette2">{answer}</div>
      </Drawer>
      <hr className="my-4 borderPalette2" />
    </>
  )
}