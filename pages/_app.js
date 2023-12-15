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
import { ImageFallbackProvider } from "../contexts/imageFallback";
import { ActionCableProvider } from "../contexts/webSocket";
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: '3a85e746b40741d2908329451d953da0',
  environment: process.env.NEXT_PUBLIC_REACT_APP_STAGE,
};

import LogRocket from 'logrocket';
LogRocket.init('dnqy5r/collector');

import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://b72da4ba37cb647f278b6fa0a8d3c93d@o4506401383645184.ingest.sentry.io/4506401389150208",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/collector\.sh\/collector-api/, /^https:\/\/collector\.sh\/collector-node-api/], 
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
          <meta name="keywords" content="Collect, Collector.sh, Collector, Curate, Discover, Art, Beautiful" />
          <meta key="view" name="viewport" content="width=device-width, initial-scale=1" />

          <link key="icon" rel="icon" href="/favicon.ico" />
          <meta name="twitter:site" content="@collector_sh" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta key="og-title" property="og:title" content="Collector" />
          <meta key="twitter-title" name="twitter:title" content="Collector" />

          <meta key="description" name="description" content={metaDescription} />
          <meta key="og-description" property="og:description" content={metaDescription} />
          <meta key="og-url" property="og:url" content="https://collector.sh/" />
          <meta key="og-image" property="og:image" content={metaPreviewImage} />

          <meta key="twitter-description" name="twitter:description" content={metaDescription} />
          <meta key="twitter-image" name="twitter:image" content={metaPreviewImage} />

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
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
      
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
                              <UserTokensProvider>
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
                              </UserTokensProvider>
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

        </ErrorBoundary>
      </Provider>
    </>
  );
}

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { metaDescription, metaPreviewImage } from "../config/settings";
import { UserTokensProvider } from "../contexts/userTokens";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
