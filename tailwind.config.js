import {fontFamily} from 'tailwindcss/defaultTheme'


module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", ...fontFamily.sans],
        display: ["DM Serif Text", ...fontFamily.serif],
      },
      colors: {
        orange: "#FDA63E",
        gallery_background: "#17132E",
        lellow: "#FDD513",
        blu: "#27CFF1",
        burple: "#9946ff",
        burpledark: "#652db0",
        greeny: "#31f292",
        greendarkbg: "#425A41",
        greenlightbg: "#BCF3C9",
        exchange: "#AEEA00",
        navbg: "#F5F5F5",
        dark1: "#121212",
        dark15: "#161616",
        dark2: "#212121",
        dark3: "#262626",
        dark4: "#aaaaaa",
        whitish: "#E7E7E7",
        offwhite: "#F7F7F7",
      },
      backgroundImage: {
        "mint-bg": "url('/images/mintbg.png')",
      },
      keyframes: {
        enter: {
          '0%': { opacity: 0, transform: "translateY(2rem)" },
          '100%': { opacity: 1, transform: "translateY(0rem)" },
        }
      },
      animation: {
        enter: 'enter 1s ease-out',
      },
      height:{
        screen: ['100vh', '100svh'],
        page: ["calc(100vh - 76px)", "calc(100svh - 76px)"],
        pageImageOffset: ["calc(100vh - 296px)", "calc(100svh - 296px)"] //double nav bar (223px) + image height (144px) to center the text below image
      },
      maxHeight: {
        screen: ['100vh', '100svh'],
        page: ["calc(100vh - 76px)", "calc(100svh - 76px)"],
        pageImageOffset: ["calc(100vh - 296px)", "calc(100svh - 296px)"] //double nav bar (223px) + image height (144px) to center the text below image
      },
      minHeight: {
        screen: ['100vh', '100svh'],
        page: ["calc(100vh - 76px)", "calc(100svh - 76px)"],
        pageImageOffset: ["calc(100vh - 296px)", "calc(100svh - 296px)"] //double nav bar (223px) + image height (144px) to center the text below image
      },
      pointerEvents: ['hover', 'no-touch'],
      scale: {
        '-1': '-1',
      }
    },
  },
  plugins: [],
};

// {
//   screen: ['100vh', '100svh', 'calc(var(--vh, 1svh) * 100)'],
//     page: ["calc(100vh - 76px)", "calc(100svh - 76px)", 'calc((var(--vh, 1svh) * 100) - 76px)'],
//       pageImageOffset: ["calc(100vh - 296px)", "calc(100svh - 296px)", 'calc((var(--vh, 1svh) * 100) - 296px)'] //double nav bar (223px) + image height (144px) to center the text below image
// },
