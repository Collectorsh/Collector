import MainNavigation from "/components/navigation/MainNavigation";
import Secondary from "/components/signature/Secondary";

export default function Listings() {
  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <Secondary />
      </div>
    </div>
  );
}
