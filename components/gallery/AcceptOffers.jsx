import Link from "next/link";

export default function AcceptOffers({ token }) {
  if (token.accept_offers !== true) return null;

  return (
    <div className="rounded-[100px] backdrop-blur-lg bg-white/60 px-4 py-2 font-semibold cursor-pointer absolute top-3 right-3 hover:scale-105">
      <Link href={`/nft/${token.mint}`} title="">
        <a>Accepting Offers</a>
      </Link>
    </div>
  );
}
