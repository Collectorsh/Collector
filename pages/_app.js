import "../styles/globals.css";
import "../styles/toast.css";
import "../styles/wallet-adapter.css";

import Head from "next/head";
import { WalletContextProvider } from "/contexts/wallet";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "/contexts/user";
import { ListingsProvider } from "/contexts/listings";
import { ActivitiesProvider } from "/contexts/activities";
import { FollowingProvider } from "/contexts/following";
import { SingleNftProvider } from "/contexts/single_nft";
import { CartProvider } from "/contexts/cart";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PlausibleProvider from "next-plausible";
import Footer from "/components/Footer";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <div>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="keywords" content="Collect &amp; Share beautiful art" />
          <meta name="author" content="Collector" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Serif+Text&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <title>Discover &amp; Share Beautiful Art</title>
        </Head>
      </div>
      <ApolloProvider client={client}>
        <WalletContextProvider>
          <UserProvider>
            <ListingsProvider>
              <ActivitiesProvider>
                <FollowingProvider>
                  <SingleNftProvider>
                    <ThemeProvider enableSystem={true} attribute="class">
                      <PlausibleProvider domain="collector.sh">
                        <CartProvider>
                          <div className="min-h-[100vh]">
                            <Component {...pageProps} />
                          </div>
                          <Footer />
                        </CartProvider>
                      </PlausibleProvider>
                    </ThemeProvider>
                  </SingleNftProvider>
                </FollowingProvider>
              </ActivitiesProvider>
            </ListingsProvider>
          </UserProvider>
        </WalletContextProvider>
      </ApolloProvider>
    </>
  );
}

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
