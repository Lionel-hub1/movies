/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF014C",
        primaryDark: "#504A7980",
        secondary: "#F0BE4D",
        gradientOne: "#FF004D21",
        gradientTwo: "#1F2F9821",
        tertiary: "#FF014C",
        background: "#030303",
        headText: "#c8c8c8",
        bodyText: "#cecece",
        bodySecondary: "#F8F8F8",
        linesColor: "#A69BFF",
      }
    },
  },
  plugins: [],
}

