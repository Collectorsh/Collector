// import '@solana/wallet-adapter-react-ui/styles.css';
import "../styles/wallet-adapter.css";
import "../styles/toast.css";
import "../styles/globals.css";


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
import PlausibleProvider from "next-plausible";
import Footer from "/components/Footer";
import { ImageFallbackProvider } from "../contexts/imageFallback";
import { ActionCableProvider } from "../contexts/webSocket";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { metaDescription, metaPreviewImage } from "../config/settings";
import { UserTokensProvider } from "../contexts/userTokens";
import { VideoFallbackProvider } from "../contexts/videoFallback";
import { RpcHealthProvider } from "../contexts/RpcHealth";
import { HighlightInit } from '@highlight-run/next/client'
import { useEffect } from "react";


// const client = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
//   cache: new InMemoryCache(),
// });

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  // useEffect(() => {
  //   const setVhVariable = () => {
  //     const vh = window.innerHeight * 0.01;
  //     document.documentElement.style.setProperty('--vh', `${ vh }px`);
  //   };

  //   setVhVariable();
  //   window.addEventListener('resize', setVhVariable);
  //   window.addEventListener('orientationchange', setVhVariable);

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener('resize', setVhVariable);
  //     window.removeEventListener('orientationchange', setVhVariable);
  //   };
  // }, []);

  return (
    <>
      <div>
        <Head>
          <meta charSet="UTF-8" />
          <title>Collector</title>
          <meta name="author" content="Collector" />
          <meta name="keywords" content="Collect, Collector.sh, Collector, Curate, Discover, Art, Beautiful" />
          <meta key="view" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

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

       
         
          {/* <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          /> */}
        </Head>      
      </div>
      <HighlightInit
        excludedHostnames={['localhost']}
        projectId={'neykmqvg'}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
      {/* <ApolloProvider client={client}> */}
        <RpcHealthProvider>
          <WalletContextProvider>
            <UserProvider>
   
                <ActionCableProvider>
                  <ImageFallbackProvider>
                    <VideoFallbackProvider>
                      <ListingsProvider>
                        <ActivitiesProvider>
                          <FollowingProvider>
                            <OffersProvider>
                              <SingleNftProvider>
                                <UserTokensProvider>
                                  <ThemeProvider enableSystem={true} attribute="class">
                                    <PlausibleProvider domain="collector.sh">
                                      <CartProvider>
                
                                        <div className="min-h-screen h-fit">
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
                    </VideoFallbackProvider>
                  </ImageFallbackProvider>
                </ActionCableProvider>    
            </UserProvider>
          </WalletContextProvider>
        </RpcHealthProvider>
        {/* </ApolloProvider> */}
    </>
  );
}

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
