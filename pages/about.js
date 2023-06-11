import Link from "next/link";
import MainNavigation from "/components/navigation/MainNavigation";

export default function About() {
  return (
    <div className="dark:bg-black dark:text-whitish">
      <MainNavigation />
      <div className="max-w-3xl mx-auto pb-12">
        <div className="px-4">
          <h2 className="text-2xl w-full pt-8 font-extrabold mb-8 text-black inline-block dark:text-whitish">
            About Collector
          </h2>
          <p>
            Welcome to Collector, your place to discover and share beautiful art.
            <br/><br/>
            At Collector, we believe that great art deserves to be seen. Our platform is here to help you find stunning digital art, making it easy for anyone to enjoy creativity at its finest.
            <br/><br/>
            The world of NFTs has changed how we create, share, and collect art, allowing everyone to take part. But as more and more art fills the NFT market, it&apos;s becoming harder to find the real gems. Lots of talented artists get lost in the crowd, and it&apos;s often hard to know where to look.
            <br /><br />
            Here at Collector, we strive to cut through the noise. Our platform empowers artists and collectors to tell the stories behind the artwork, providing a rich context that deepens appreciation and builds trust. We&apos;re dedicated to making the art discovery process simpler, more meaningful, and more enjoyable for everyone.
            <br /><br />
            One of our unique features is our free 2D galleries. These galleries allow collectors to showcase their collections and introduce others to their favorite artists. This way, we can create a community where art is shared and enjoyed by all.
            <br /><br />
            And this is just the start. We invite you to join us on this journey, to help shape the digital art world and bring talented artists into the spotlight.
            <br /><br />
            Welcome to Collector. Welcome to the future of art discovery.
          </p>
        </div>
      </div>
    </div>
  );
}
