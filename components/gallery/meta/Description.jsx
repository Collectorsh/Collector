export default function Description({ token }) {
  return (
    <p className="text-sm clear-both text-dark3 dark:text-neutral-300 break-words mt-2">
      {token.description}
    </p>
  );
}
