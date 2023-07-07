import "../styles/globals.css";
import "../styles/toast.css";
import "../styles/wallet-adapter.css";

import Head from "next/head";
import { WalletContextProvider } from "/contexts/wallet";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "/contexts/user";
import { ListingsProvider } from "/contexts/listings";
import { OffersProvider } from "/contexts/offers";
import { ActivitiesProvider } from "/contexts/activities";
import { FollowingProvider } from "/contexts/following";
import { SingleNftProvider } from "/contexts/single_nft";
import { CartProvider } from "/contexts/cart";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PlausibleProvider from "next-plausible";
import Footer from "/components/Footer";
import banner from "/public/Collector Hero.jpeg"
import { ImageFallbackProvider } from "../contexts/imageFallback";
import { ActionCableProvider } from "../contexts/webSocket";

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
          <title>Collector</title>
          <meta name="author" content="Collector" />
          <meta name="keywords" content="Collect &amp; Share beautiful art" />

          <meta key="desc" name="description" content="Discover &amp; Share Beautiful Art" />
          <meta key="view" name="viewport" content="width=device-width, initial-scale=1" />
          <meta key="ogtitle" name="og:title" content="Collector" />
          <meta key="ogdesc" name="og:description" content="Discover &amp; Share Beautiful Art" />
          <meta key="image" property="og:image" content={banner.src} />
          <meta key="twitimage" property='twitter:image' content={banner.src} />
          <meta key="url" name="og:url" content="https://collector.sh/" />
          <meta key="card" property="twitter:card" content="summary_large_image" />
          <link key="icon" rel="icon" href="/favicon.ico" />

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
         
        </Head>
      </div>
      <ApolloProvider client={client}>
        <WalletContextProvider>
          <UserProvider>
            <ActionCableProvider>
              <ImageFallbackProvider>
                <ListingsProvider>
                  <ActivitiesProvider>
                    <FollowingProvider>
                      <OffersProvider>
                        <SingleNftProvider>
                          <ThemeProvider enableSystem={true} attribute="class">
                            <PlausibleProvider domain="collector.sh">
                              <CartProvider>
                                <div className="min-h-[100vh] dark:bg-black dark:text-white">
                                  <Component {...pageProps} />
                                </div>
                                <Footer />
                              </CartProvider>
                            </PlausibleProvider>
                          </ThemeProvider>
                        </SingleNftProvider>
                      </OffersProvider>
                    </FollowingProvider>
                  </ActivitiesProvider>
                </ListingsProvider>
              </ImageFallbackProvider>
            </ActionCableProvider>
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
