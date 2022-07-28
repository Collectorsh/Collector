import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function Faq() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <div className="px-4 xl:px-0">
          <h2 className="text-2xl w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
            Frequenty Asked Questions
          </h2>

          <h2 className="w-full pb-2 font-extrabold mt-6text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            What is Collector?
          </h2>

          <p>
            Collector is a place to discover, collect, and share beautiful art
            on Solana.
          </p>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            Who can join Collector and how much does it cost?
          </h2>
          <p>Anyone can join Collector and it is 100% free</p>
          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            How can I get started?
          </h2>

          <ul>
            <li>
              Connect your Solana wallet
              <br />⁃ Approve the Signature Request to prove ownership
            </li>
            <li>Claim your profile and choose username</li>
            <li>Connect your Twitter</li>
            <li>Customize your notifications</li>
            <li>Connect multiple wallets</li>
          </ul>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            Can I connect a ledger wallet?
          </h2>

          <p>
            Yes, but you need to dm{" "}
            <Link href="https://twitter.com/n8solomon">
              <a>@n8solomon</a>
            </Link>{" "}
            on Twitter and the Collector team will set it up.
          </p>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            How do I follow artists?
          </h2>

          <p>Head to your profile ➡️ Settings ➡️ Follow Artists</p>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            How do I create my gallery?
          </h2>

          <ul>
            <li>
              Head over to your profile and click on setting (tool on the right)
              ➡️ Edit Gallery
            </li>
            <li>Drag and drop to order or hide pieces</li>
            <li>Click on Settings to customize your gallery</li>
            <li>
              You can now view your gallery at collector.sh/yourname
              <br />⁃ remember, beautiful art deserves to be shared 🤝
            </li>
            <li>beautiful art deserves to be shared</li>
            <li>
              NFT must be in one of your connect wallets
              <br />⁃ Listing your NFT on a marketplace that uses custodial
              contracts will remove the NFT from your gallery
            </li>
          </ul>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            I’m an artist. How can I use Collector?
          </h2>

          <ul>
            <li>
              As an artist on Solana you are already in the Collector database
              <br />⁃ This means that your collectors or art focused communities
              can follow you. Your followers will get notified when:
              <br />⁃ auction start
              <br />⁃ auction is almost ending
              <br />⁃ new listing
              <br />⁃ edition drop
            </li>
            <li>
              Claim your profile
              <br />⁃ Curate a gallery of your own work or feature pieces that
              you’ve collected
              <br />⁃ Sell your NFTs
            </li>
          </ul>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            How to list your NFTs and what are the fees?
          </h2>

          <ul>
            <li>Seller fee is 1%</li>
            <li>Head to your profile ➡️ Settings ➡️ Edit Gallery</li>
            <li>
              Find the NFT that you want to sell and click &quot;List&quot;
            </li>
            <li>
              Make sure that you’re signed in with the wallet that holds the NFT
              <br />• Make sure that you’re signed in with the wallet that holds
              the NFT
            </li>
            <li>Set your price and click &quot;List&quot;</li>
            <li>
              Collector uses a non-custodial contract so the NFT will stay in
              your wallet until it either sells or your cancel the listing
            </li>
            <li>Full artist royalties respect</li>
          </ul>

          <h2 className="w-full pb-2 font-extrabold mt-12 text-black inline-block dark:text-whitish border-b border-whitish dark:border-dark3 mb-4">
            How does Collector use social curation?
          </h2>

          <p className="mb-12">
            At Collector, the entire community decides what NFTs get featured in
            the main Activity feed.
          </p>
        </div>
      </div>
    </div>
  );
}
