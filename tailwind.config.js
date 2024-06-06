import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/**/*.tsx", "./src/renderer/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)"],
      },
      height: {
        "screen-1/2": "50vh",
        "screen-1/3": "33.333333vh",
        "screen-2/3": "66.666667vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
        "8px": "8px",
        "10px": "10px",
        "20px": "20px",
        "25px": "25px",
        "30px": "30px",
        "40px": "40px",
        "45px": "45px",
        "48px": "48px",
        "50px": "50px",
        "100px": "100px",
        "130px": "130px",
        "500px": "500px",
        "525px": "525px",
      },
    },
  },
  plugins: [],
};
