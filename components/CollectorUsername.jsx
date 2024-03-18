import Link from "next/link";

export default function CollectorUsername({ username }) {
  return (
    <Link href={`/${username}/profile`} title="" legacyBehavior>
      <a className="font-bold hover:underline">
        <span className="px-0.5 dark:text-white">{username}</span>
      </a>
    </Link>
  );
}
