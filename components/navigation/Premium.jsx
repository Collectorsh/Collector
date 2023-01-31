import Link from "next/link";

export default function PremiumNavigation() {
  return (
    <p className="menu mr-8 text-lg cursor-pointer inline font-normal text-gray-900 dark:text-gray-100">
      <Link href="/mint">
        <a className="text-greeny">Premium</a>
      </Link>
    </p>
  );
}
