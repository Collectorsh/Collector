module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
