export default function CollectorLogo({ color }) {
  return (
    <span
      className="font-sans text-sm text-black dark:text-white"
      style={{ color: color }}
    >
      <div className="w-3 h-3 rounded-full bg-greeny inline-block align-middle mr-1 -mt-0.5"></div>
      Collector
    </span>
  );
}
