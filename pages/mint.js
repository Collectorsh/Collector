import MainNavigation from "/components/navigation/MainNavigation";
import Mint from "/components/mint/Mint";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { ToastContainer } from "react-toastify";

export default function MintHome() {
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
        <div className="max-w-7xl mx-auto bg-mint-bg bg-cover h-screen">
          <ThemeProvider theme={theme}>
            <h1 className="w-fit mx-auto text-4xl font-extrabold text-white text-center mb-10 p-2 mt-4">
              Mint a &apos;Signature&apos; piece and unlock Collector Premium!
            </h1>
            <p className="w-fit text-white p-2 max-w-5xl mx-auto text-center">
              &apos;Signature&apos; is an art project from the co-founders of
              Collector, Richard and Nate.
            </p>
            <p className="w-fit text-white p-2 max-w-3xl mt-2 mx-auto text-center">
              Each piece is a unique artwork that combines 30 of Nate&apos;s
              photos and Richard&apos;s custome glitch program.
            </p>
            <p className="w-fit text-white p-2 max-w-3xl mt-2 mx-auto text-center">
              We hope that you enjoy the art and all of the premium features
              that it unlocks.
            </p>
            <Mint />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}
