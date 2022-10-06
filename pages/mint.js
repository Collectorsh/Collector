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
        <div className="max-w-7xl mx-auto bg-mint-bg bg-cover h-screen">
          <MainNavigation />
          <ThemeProvider theme={theme}>
            <h1 className="w-fit mx-auto text-4xl font-extrabold text-white text-center mb-10 p-2 mt-4">
              Signature: art project &#43; premium membership
            </h1>
            <p className="w-fit text-white p-2 max-w-5xl mx-auto text-center">
              Each NFT is a unique algorithmic artwork that combines Nate&apos;s
              photos and Richard&apos;s code into a single digital signature.
            </p>
            <p className="w-fit text-white p-2 max-w-3xl mt-12 mx-auto text-center">
              In addition to the art, holders gain access to{" "}
              <strong>premium features on collector.sh</strong>
            </p>
            <Mint />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}
