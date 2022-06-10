import Link from "next/link";
import { host } from "/config/settings";

export default function CollectorUsername({ username }) {
  return (
    <Link href={`${host}/${username}`} title="">
      <a className="font-bold">
        <span className="bg-greeny px-0.5 text-black rounded">{username}</span>
      </a>
    </Link>
  );
}
