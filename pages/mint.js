import MainNavigation from "/components/navigation/MainNavigation";
import Mint from "/components/mint/Mint";
import { createTheme, ThemeProvider } from "@material-ui/core";

export default function MintHome() {
  const theme = createTheme({
    palette: {
      type: "dark",
    },
  });

  return (
    <div className="dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <MainNavigation />
        <ThemeProvider theme={theme}>
          <Mint />
        </ThemeProvider>
      </div>
    </div>
  );
}
