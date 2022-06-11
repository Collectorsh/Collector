import { descriptionPadding } from "/utils/layoutOptions";

export default function NameAndDescription({ user, token }) {
  if (user && !user.names && !user.description) return null;

  return (
    <>
      {(!user || user.names) && (
        <h4 className="text-md font-bold mt-1 left text-dark1 dark:text-gray-200">
          {token.name}
        </h4>
      )}
    </>
  );
}
