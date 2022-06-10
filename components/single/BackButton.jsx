import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();

  return (
    <>
      <a
        scroll={false}
        className="font-bold hover:text-gray-700 cursor-pointer dark:text-gray-100"
        onClick={() => router.back({ scroll: false })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="align-middle">Back</span>
      </a>
    </>
  );
}
