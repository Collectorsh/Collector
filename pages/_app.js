import "../styles/globals.css";
import "../styles/toast.css";
import "../styles/wallet-adapter.css";

import Head from "next/head";
import { WalletContextProvider } from "/contexts/wallet";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "/contexts/user";
import { EstimatedValueProvider } from "/contexts/estimated_value";
import { ExchangeOffersProvider } from "/contexts/exchange_offers";
import { ListingsProvider } from "/contexts/listings";
import { ActivitiesProvider } from "/contexts/activities";
import { SingleNftProvider } from "/contexts/single_nft";
import { FollowingProvider } from "/contexts/following";
import PlausibleProvider from "next-plausible";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

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
          <meta charset="UTF-8" />
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
            charset="UTF-8"
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
      <PlausibleProvider domain="collector.sh">
        <ApolloProvider client={client}>
          <WalletContextProvider>
            <UserProvider>
              <ExchangeOffersProvider>
                <ListingsProvider>
                  <ActivitiesProvider>
                    <SingleNftProvider>
                      <EstimatedValueProvider>
                        <FollowingProvider>
                          <ThemeProvider enableSystem={true} attribute="class">
                            <Component {...pageProps} />
                          </ThemeProvider>
                        </FollowingProvider>
                      </EstimatedValueProvider>
                    </SingleNftProvider>
                  </ActivitiesProvider>
                </ListingsProvider>
              </ExchangeOffersProvider>
            </UserProvider>
          </WalletContextProvider>
        </ApolloProvider>
      </PlausibleProvider>
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
