import MainNavigation from "/components/navigation/MainNavigation";
import Hero from "/components/home/Hero";
import Featured from "/components/home/Featured";
import Footer from "/components/home/Footer";
import Feed from "/components/home/Feed";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-black">
      <MainNavigation />
      <Hero />
      <Featured />
      <Feed />
      {/* <Footer /> */}
    </div>
  );
}
