import "../styles/tailwind.css";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import WalletProvider from "../context/WalletContext";
import NotificationProvider from "../context/NotificationContext";
import Script from "next/script";
import * as gtag from "../lib/gtag";

import Layout from "../hoc/Layout/Layout";
import LogoLoadingSpinner from "../components/ui/LogoLoadingSpinner/LogoLoadingSpinner";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlerRouterChangeStart = (url) => {
    setLoading(true);
  };

  const handlerRouterChangeComplete = (url) => {
    gtag.pageview(url);
    setLoading(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handlerRouterChangeStart);
    router.events.on("routeChangeComplete", handlerRouterChangeComplete);
    router.events.on("routeChangeError", handlerRouterChangeComplete);
  }, [router]);

  if (router.isFallback) {
    return <LogoLoadingSpinner />;
  }

  return (
    <Fragment>
      <NotificationProvider>
        <WalletProvider>
          <Layout>
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
            {/* This will view a loading progress Logo when switching pages */}
            {loading ? <LogoLoadingSpinner /> : <Component {...pageProps} />}
          </Layout>
        </WalletProvider>
      </NotificationProvider>
    </Fragment>
  );
}

export default MyApp;
