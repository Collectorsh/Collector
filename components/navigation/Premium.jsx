import Link from "next/link";

export default function PremiumNavigation() {
  return (
    <p className="menu mr-8 text-lg cursor-pointer inline font-normal text-neutral-900 dark:text-neutral-100">
      <Link href="/mint">
        <a className="border-b-2 border-greeny">Premium</a>
      </Link>
    </p>
  );
}
