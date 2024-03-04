import Link from "next/link";

export default function AcceptOffers({ token }) {
  if (token.accept_offers !== true) return null;

  return (
    <div className="text-sm cursor-pointer text-dark3 dark:text-neutral-300 bg-whitish dark:bg-dark3 w-fit px-2 py-1 rounded cursor-pointer absolute top-3 right-3">
      <Link href={`/nft/${token.mint}`} title="">
        <a>Accepting Offers</a>
      </Link>
    </div>
  );
}
