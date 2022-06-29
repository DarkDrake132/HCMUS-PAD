import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/tailwind.css";

// MUI COMPONENTS
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// CUSTOM THEME CONFIG
import themeObject from "../theme";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import WalletProvider from "../context/WalletContext";
import NotificationProvider from "../context/NotificationContext";
import Script from "next/script";

import Layout from "../hoc/Layout/Layout";
import LogoLoadingSpinner from "../components/ui/LogoLoadingSpinner/LogoLoadingSpinner";

const customThemeObject = createTheme(themeObject);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlerRouterChangeStart = (url) => {
    setLoading(true);
  };

  const handlerRouterChangeComplete = (url) => {
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
    <ThemeProvider theme={customThemeObject}>
      <CssBaseline />
      <NotificationProvider>
        <WalletProvider>
          <Layout>
            {/* This will view a loading progress Logo when switching pages */}
            {loading ? <LogoLoadingSpinner /> : <Component {...pageProps} />}
          </Layout>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default MyApp;
