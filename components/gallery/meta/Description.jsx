export default function Description({ token }) {
  return (
    <p className="text-sm clear-both text-dark3 dark:text-gray-300 break-words">
      {token.description}
    </p>
  );
}
