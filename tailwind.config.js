const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.js",
    "./pages/*.js",
    "./components/**/*.js",
    "./components/**/**/*.js",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: { max: "640px" },
      md: { max: "820px" },
      lg: { max: "1024px" },
      xl: { max: "1280px" },
      "2xl": { max: "1440px" },
    },
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "3xl": "1px 1px 10px 1px rgba(0, 0, 0, 0.3)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      none: "none",
    },
    extend: {
      colors: {
        primary: "#89CFF0",
        secondary: "#0E86D4",
        tertiary: "#2E8BC0",
        accent: "#C26573",
        tertiaryBg: "#5FA8DC",
        customGreen: "#2A8300",
        customRed: "#CC0000",
        customlightRed: "#FF0000",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        vlAllRoundGothicBook: ["VlAllRoundGothicBook", "sans-serif"],
      },
      fontSize: {
        "1xl": ["1.4rem", "2rem"],
        xl3: ["1.7rem", "2.25rem"],
      },
      scale: {
        101: "1.01",
      },
      backgroundImage: {
        homePageBanner: "url(/HomePageBanner.png)",
        endedPoolsBg: "url(/EndedPoolsBg.png)",
        walletBg: "url(/WalletBg.png)",
        progressBarBg: "url(/ProgressBarBg.png)",
        logoOutsideBg: "url(/logo/LogoOutside.svg)",
      },
      height: {
        55: "13.75rem",
        84: "21rem",
        88: "22rem",
        92: "23rem",
        100: "25rem",
        101: "26rem",
        102: "27rem",
        103: "28rem",
        104: "29rem",
        105: "30rem",
      },
      minHeight: {
        20: "5rem",
      },
      minWidth: {
        1040: "65rem",
      },
      width: {
        84: "21rem",
        88: "22rem",
        92: "23rem",
        100: "25rem",
        101: "26rem",
        102: "27rem",
        103: "28rem",
        104: "29rem",
        105: "30rem",
      },
      borderWidth: {
        1: "1px",
        3: "3px",
        6: "6px",
      },
      transitionDuration: {
        400: "400ms",
      },
      backgroundSize: {
        "200%": "200%",
      },
      animation: {
        "spin-slow": "spin 2.8s linear infinite",
      },
    },
  },
  variants: {
    extend: {
      transitionDelay: ["hover", "focus"],
      transitionDuration: ["hover", "focus"],
      transitionProperty: ["hover", "focus"],
      transitionTimingFunction: ["hover", "focus"],
      textOverflow: ["hover", "focus"],
      maxHeight: ["hover", "focus"],
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          "@media (min-width: 640px)": {
            maxWidth: "640px",
          },
          "@media (min-width: 820px)": {
            maxWidth: "820px",
          },
          "@media (min-width: 1024px)": {
            maxWidth: "1024px",
          },
          "@media (min-width: 1280px)": {
            maxWidth: "1280px",
          },
          "@media (min-width: 1440px)": {
            maxWidth: "1440px",
          },
        },
      });
    },
  ],
};
