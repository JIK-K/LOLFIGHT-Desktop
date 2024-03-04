/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/page/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "350px": "350px",
      },
      colors: {
        transparent: "transparent",
        brandcolor: "#11235A",
        brandbgcolor: "#EFEFEF",
        // brandbgcolor: "#FAFAFA",
      },
    },
  },

  plugins: [],
};
