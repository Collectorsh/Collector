import MainNavigation from "/components/navigation/MainNavigation";
import Mint from "/components/mint/Mint";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MintHome() {

  const router = useRouter();
  useEffect(() => {
    router.replace("/")
  }, [router])

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1>404</h1>
    </div>
  )
  const theme = createTheme({
    palette: {
      type: "dark",
    },
  });

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="dark:bg-black">
        <MainNavigation />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 sm:my-12 bg-white dark:bg-black dark:text-white">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
            <div className="col-span-1 sm:col-span-3">
              <h2 className="text-2xl font-bold w-fit">Signature Pass</h2>
              <p className="mt-4">
                Get access to curated drops from top artists, advanced discovery
                tools, and more with a Signature Pass. Your support helps grow
                the Collector ecosystem and a more inclusive art world.
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <ThemeProvider theme={theme}>
                <Mint />
              </ThemeProvider>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
            <img
              src="https://cdn.collector.sh/signature/0.png"
              className="w-full h-96 lg:h-64 object-center object-cover"
            />
            <img
              src="https://cdn.collector.sh/signature/1.png"
              className="w-full h-96 lg:h-64 object-center object-cover"
            />
            <img
              src="https://cdn.collector.sh/signature/2.png"
              className="w-full h-96 lg:h-64 object-center object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mt-8">Pass Benefits</h2>
          <p className="mt-4">
            <ul className="list-disc ml-4">
              <li>Priority access to curated drops</li>
              <li>Advanced discovery tools</li>
              <li>Follow your favorite artists</li>
              <li>Personalize notifications</li>
              <li>Bid Tracking</li>
            </ul>
          </p>
          <h2 className="text-2xl font-bold mt-8">Why Signature Pass?</h2>
          <p className="mt-4">
            The Signature Pass is for collectors who want a seamless, enjoyable,
            and exclusive art collecting experience on Solana. Your support
            helps a bootstrapped team of two build collector.sh, the only
            platform for art discovery, collection, and sharing on Solana.
          </p>
          <h2 className="text-2xl font-bold mt-8">The Pass</h2>
          <p className="mt-4">
            The Signature Pass enhances your Collector experience. This 521
            supply collection, created by the co-founders of Collector, features
            30 of Nate&apos;s photos randomly glitched by Richard’s custom
            program. Each piece is unique and reflects Nate and Richard&apos;s
            digital signature as art enthusiasts and builders.
          </p>
        </div>
      </div>
    </>
  );
}
