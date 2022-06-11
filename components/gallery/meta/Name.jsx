export default function NameAndDescription({ token }) {
  return (
    <h4 className="text-md font-bold mt-1 left text-dark1 dark:text-gray-200">
      {token.name}
    </h4>
  );
}
