import Activity from "/components/home/feed/Activity";
import RightColumn from "/components/home/RightColumn";

export default function Feed() {
  return (
    <div id="feed" className="pl-2 px-4 xl:px-0 pt-2 md:pt-4">
      <Activity />
      {/* <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-7 lg:col-span-5 min-h-screen">
          <Activity />
        </div>
        <div className="hidden md:block md:col-span-4 md:col-end-13">
          <RightColumn />
        </div>
      </div> */}
    </div>
  );
}
