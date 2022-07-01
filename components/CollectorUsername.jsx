import Link from "next/link";
import { host } from "/config/settings";

export default function CollectorUsername({ username }) {
  return (
    <Link href={`${host}/${username}/profile`} title="">
      <a className="font-bold hover:underline">
        <span className="px-0.5 dark:text-white">{username}</span>
      </a>
    </Link>
  );
}
