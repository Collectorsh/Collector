export default function NameAndDescription({ token }) {
  return (
    <h4 className="text-lg font-bold mt-1 left text-dark1 dark:text-neutral-200">
      {token.name}
    </h4>
  );
}
