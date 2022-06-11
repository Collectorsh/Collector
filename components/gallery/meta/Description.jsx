export default function Description({ user, token }) {
  if (user && !user.names && !user.description) return null;

  return (
    <>
      {(!user || user.description) && (
        <p className="text-sm clear-both text-dark3 dark:text-gray-300 break-words">
          {token.description}
        </p>
      )}
    </>
  );
}
