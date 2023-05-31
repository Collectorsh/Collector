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

  


          {/* <p>
            We&apos;re Richard & Nate, the co-founders of Collector. Our passion
            for digital art inspired us to create a platform that makes it
            easier to share, discover, and collect beautiful digital artwork on
            Solana.
          </p>
          <p className="mt-4">
            Our 2D gallery is a popular way to showcase art collections and
            we&apos;re proud to offer it for free and open source. We believe
            every artwork deserves visibility and our goal is to bring the
            fragmented Solana art scene together in one place.
          </p>
          <p className="mt-4">
            We&apos;re also excited to announce our Drops feature, where artists
            can sell their work in new and creative ways, giving collectors
            unique experiences in buying art.
          </p>
          <p className="mt-4">
            Collector offers a free activity feed and advanced discovery tools
            to help you find the perfect artwork for your collection. Our
            mission is to make collecting digital art easy, enjoyable, and
            accessible to everyone.
          </p>
          <p className="mt-4">
            We&apos;re always here to help, so don&apos;t hesitate to reach out
            via Twitter. We appreciate your feedback and look forward to growing
            with the Solana art community.
          </p>
          <p className="mt-4 font-semibold">
            -{" "}
            <Link href="https://twitter.com/richjard" title="Twitter">
              <a className="text-[#1E9BF0]" target="_blank">
                Richard
              </a>
            </Link>{" "}
            &{" "}
            <Link href="https://twitter.com/n8solomon" title="Twitter">
              <a className="text-[#1E9BF0]" target="_blank">
                Nate
              </a>
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
