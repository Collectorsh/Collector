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
        <div className="max-w-7xl mx-auto">
          <MainNavigation />
          <ThemeProvider theme={theme}>
            <Mint />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}
