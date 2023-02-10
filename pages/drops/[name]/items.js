import Nft from "./nft";

export default function Items({ items }) {
  return (
    <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center sm:justify-start">
      {items.map((mint, index) => (
        <Nft mint={mint} key={index} />
      ))}
    </div>
  );
}
